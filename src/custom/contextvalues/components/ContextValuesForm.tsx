import {useActiveUI} from '@activeviam/activeui-sdk';
import {jsx} from '@emotion/core';
import {Button, Form, List} from 'antd';
import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import {ContextValueDescription, CubeAndContextValues} from '../contextvalues.types';
import {updateContextValues} from '../utils/contextValuesUtils';
import {ContextValueFormItem} from './ContextValueFormItem';


export const ContextValuesForm = (props: any)=> {

  const {cubeAndContextValues, cancel }  = props;

  const activeUI = useActiveUI();
  const settings = activeUI.settings;

  const [updatedCVs, setUpdatedCVs] = useState<CubeAndContextValues>(cubeAndContextValues);

  const updateCVField = (cvName: string, cvValue: any) => {
    let newCVValues = _.cloneDeep(updatedCVs);
    console.log("newCVValues")
    console.log(newCVValues)
    let index = newCVValues.contextValues.findIndex(contextValue => {
      return contextValue.name === cvName;
    });

    if (index > -1) {
      newCVValues.contextValues[index].currentValue = cvValue;
    }
    setUpdatedCVs(newCVValues);
  }



  let editors = cubeAndContextValues? cubeAndContextValues.contextValues.map((cv: ContextValueDescription) => {
    return (<ContextValueFormItem contextValue={cv} updateCV={updateCVField}/>)
  }) : [];

  const saveContextValues =(values: any): void=> {
    console.log("saving context values: ", values)
  }

  const submit = () => {
    let userCVs = settings.get("user.contextValues");
    let updatedUserCVs = _.cloneDeep(userCVs);
    updatedCVs.contextValues.forEach(contextValue => {
      updateContextValues(updatedUserCVs, updatedCVs.cube, contextValue)
    })

    console.log(updatedUserCVs);
    settings.set("user.contextValues", updatedUserCVs);
    cancel();
  }


  return (
    <div>
      <Form
        labelCol={{ span: 14 }}
        wrapperCol={{ span: 10 }}
        onSubmit={saveContextValues}
      >
        {editors}
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button onClick={cancel} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button onClick={submit} type="primary">
          Submit
        </Button>
      </div>
    </div>

  )
}