import React, { PureComponent } from 'react';
import { Typography, Card, Pagination, Row, Col, Tabs, Input, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';


import { Table, Tag, Space, Form, Select, Drawer, notification, InputNumber, DatePicker } from 'antd';

const { Option } = Select;


const tag_color =  {
  urgent: 'volcano',
  done: 'grey',
  todo: 'geekblue',
  important: 'green',
};

export default class DrawerForm extends PureComponent {

    options = [{ value: 'todo' }, { value: 'important' }, { value: 'urgent' }, { value: 'done' }];

    tagRender = (props) => {
      const { label, value, closable, onClose } = props;

      return (
          <Tag color={tag_color[value]} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
          {label.toUpperCase()}
          </Tag>
      );
    }

    render() {
      console.log(this.props)
      const {key, title, deadline, tags} = this.props.event;
      return (  
        <Drawer
          title="Edit an event"
          height={560}
          onClose={this.props.onClose}
          visible={this.props.visible}
          bodyStyle={{ paddingBottom: 80 }}
          placement="bottom"
        >
          { this.props.visible &&
          <Form layout="vertical" hideRequiredMark onFinish={this.props.onSubmit}>
            <Form.Item name="id" initialValue={key} hidden/>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please enter the title of the paper' }]}
                  initialValue={title}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={2}>
                <Form.Item
                  name="deadline"
                  label="Deadline"
                  rules={[{ required: true, message: 'Please enter the deadline' }]}
                  initialValue={moment(deadline, 'YYYY/MM/DD')}
                >
                  <DatePicker format={'YYYY/MM/DD'} />
                </Form.Item>
              </Col>
              <Col span={6} offset={1}>
                <Form.Item
                  name="tags"
                  label="Tag"
                  rules={[{ required: false, message: 'Please enter the tag' }]}
                  initialValue={tags}
                >
                  <Select
                    mode="multiple"
                    showArrow
                    tagRender={this.tagRender}
                    style={{ width: '100%' }}
                    options={this.options}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
          }
        </Drawer>
        )
    }
}
