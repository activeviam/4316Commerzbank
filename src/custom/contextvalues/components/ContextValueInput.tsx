import {Input, Select} from 'antd';
import React from 'react';

export const ContextValueInput = (props: any) => {

  const {cv, update} = props;

  const updateField = (event: any) => {
    let fieldToUpdate = event.target.id;
    let newValue = event.currentTarget.value;
    update(fieldToUpdate, newValue);
  }

  if (cv.type.startsWith('ENUM')) {
    let split = cv.type.split("(")
    // debugger;
      let enumValues = split[1].slice(0,-1).split(",");
    let options = enumValues.map((value: string)=> {
      return  (
        <Select.Option value={value}>{value}</Select.Option>)
    })
    return (
      <Select
        id={cv.name}
        defaultValue={cv.currentValue}
        onChange={update}
      >
        {options}
      </Select>
    )

  } else {
    switch (cv.type) {
      case 'BOOL':
        return (
          <Select
            id={cv.name}
            defaultValue={cv.currentValue}
            onChange={updateField}
          >
            <Select.Option value={"true"}>true</Select.Option>
            <Select.Option value={"false"}>false</Select.Option>
          </Select>
        )
      case 'LONG':
        return (
          <Input
            id={cv.name}
            key={cv.name}
            defaultValue={cv.currentValue}
            onChange={updateField}
          />

        )
      case 'ALL':
        return (
          <Input
            key={cv.name}
            id={cv.name}
            defaultValue={cv.currentValue}
            onChange={updateField}/>
        )
      case 'INTEGER':
        return (
          <Input
            key={cv.name}
            id={cv.name}
            defaultValue={cv.currentValue}
            onChange={updateField}
          />
        )
      default:
        return (
          <p>{`could not find type: ${cv.type}` }</p>
        )
    }
  }


};