/** @jsx jsx */
import {jsx} from '@emotion/core';
import {Button, Drawer} from 'antd';
import Menu from 'antd/lib/menu';
import {SubMenuProps} from 'antd/lib/menu/SubMenu';
import Modal from 'antd/lib/modal';
import Icon from 'antd/lib/icon';
import axios from 'axios';
import {useActiveUI} from '@activeviam/activeui-sdk';
import {useEffect, useState} from 'react';
import {ContextValuesForm} from '../../../custom/contextvalues/components/ContextValuesForm';

const {confirm} = Modal;

export default function SubMenu(props: SubMenuProps) {
  const activeUI = useActiveUI();
  const username = activeUI.security.getUsername();
  const translator = activeUI.i18n.getTranslator();
  let settings = activeUI.settings;
  const [cubeContextValues, setCubeContextValues] = useState([]);
  const [selectedCube, setSelectedCube] = useState(null);

  useEffect(() => {
    let userCVs = settings.get("user.contextValues");
    // console.log("userCVs");
    // console.log(userCVs);
    axios.get("http://localhost:9090/pivot/rest/v4/cube/discovery", {
        auth: {
          username: 'admin',
          password: 'admin'
        }
      })
        .then(response => {
        let contextValuesDescriptions = response.data.data.contextValues;
        let cubes = response.data.data.catalogs[0].cubes;
        let aggregateCubeContextValues = cubes.map((cube: any) => {
          let currentCubeCVs = cube.contextValues;
          let cvAggregates: any[] = []
          currentCubeCVs.forEach((currentCubeCV: any)=> {
            let cvDescriptionFound = contextValuesDescriptions.find((cvDesc: any)=> {
              // console.log(cvDesc.name);
              // console.log(currentCubeCV.name);
              return ((cvDesc.name === currentCubeCV.name) || currentCubeCV.name.startsWith(cvDesc.name.split(".$")[0]))
            });
            if (cvDescriptionFound) {
              let cvAggregate = {
                name: currentCubeCV.name,
                description: cvDescriptionFound.description,
                type: cvDescriptionFound.type,
                category: cvDescriptionFound.category,
                currentValue: currentCubeCV.value
              }
              cvAggregates.push(cvAggregate);
            }
          })

          return {cube: cube.caption, contextValues: cvAggregates}
        })
          setCubeContextValues(aggregateCubeContextValues);
        })
  }, []);


  const handleSetCubeContextValues = (event: any) =>{
    let cube = event.key;
    const selectedCube = cubeContextValues.find((cubeAndCVs: any) => cubeAndCVs.cube === cube);
    selectedCube? setSelectedCube(selectedCube): setSelectedCube(null);
  }

  const cancel = () => {
    setSelectedCube(null);
  }

  return (
    <div>
      <Menu.SubMenu {...props} title={<span>{username}</span>}>
        {cubeContextValues.map((cubeCVs:any)=> {
          return (
            <Menu.Item
              key={cubeCVs.cube}
              onClick={handleSetCubeContextValues}
            >
              {cubeCVs.cube}
            </Menu.Item>
          )
        })}
        <Menu.Item
          data-testid="MenuItem:logout"
          onClick={() =>
            confirm({
              title: translator.format('confirmation.logout.title', {
                username,
              }),
              content: translator.format('confirmation.logout.content', {
                username,
              }),
              onOk() {
                activeUI.security.logout().then(() => window.location.reload());
              },
            })
          }
        >
          <Icon type="logout" style={{marginRight: '8px'}} />
          {translator.format('bookmarks.dashboard.logout')}
        </Menu.Item>
      </Menu.SubMenu>
        <Drawer width={800} visible={selectedCube !== null}>
          <ContextValuesForm
            cubeAndContextValues={selectedCube}
            cancel = {cancel}
          />
        </Drawer>
    </div>

  );
}
