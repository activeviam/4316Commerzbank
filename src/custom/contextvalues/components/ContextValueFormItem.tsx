import React from 'react'
import {ContextValueInput} from './ContextValueInput';
import { Form } from 'antd';


export const ContextValueFormItem = (props: any) => {

  const {contextValue, updateCV} = props;


  return (
    <Form.Item
      label={contextValue.name}
    >
      <ContextValueInput
        cv = {contextValue}
        update={updateCV}/>
    </Form.Item>

  )
}