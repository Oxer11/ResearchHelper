import React, { PureComponent } from 'react';
import { Typography, Card, Pagination, Row, Col, Tabs, Input, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FormInstance } from 'antd/lib/form';


import { Table, Tag, Space, Form, Select, Drawer, notification, InputNumber } from 'antd';

const { Option } = Select;


const tag_color =  {
    todo: 'volcano',
    never: 'grey',
    scanned: 'geekblue',
    read: 'green',
  };

export default class DrawerForm extends PureComponent {

    options = [{ value: 'todo' }, { value: 'never' }, { value: 'scanned' }, { value: 'read' }];

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
      const {key, title, url, conf, year, authors, tags, abstract} = this.props.paper;
      return (  
        <Drawer
          title="Edit a paper"
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
              <Col span={24}>
                <Form.Item
                  name="url"
                  label="URL"
                  rules={[{ required: false, message: 'Please enter url' }]}
                  initialValue={url}
                >
                  <Input
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={2}>
                <Form.Item
                  name="conf"
                  label="Conference"
                  rules={[{ required: true, message: 'Please enter the conference' }]}
                  initialValue={conf}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={2} offset={1}>
                <Form.Item
                  name="year"
                  label="Year"
                  rules={[{ required: true, message: 'Please enter the published year' }]}
                  initialValue={year}
                >
                  <InputNumber style={{ width: '100%' }} min={1000} max={3000} />
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
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="authors"
                  label="Authors"
                  rules={[{ required: true, message: 'Please enter the authors' }]}
                  initialValue={authors}
                >
                  <Input/>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="abstract"
                  label="Abstract"  
                  rules={[
                    {
                      required: false,
                      message: 'please enter the abstract',
                    },
                  ]}
                  initialValue={abstract}
                >
                  <Input.TextArea rows={3}/>
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
