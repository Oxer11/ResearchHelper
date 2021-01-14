import React, { PureComponent } from 'react';
import { Typography, Card, Pagination, Row, Col, Tabs, Input, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FormInstance } from 'antd/lib/form';
import DrawerForm from './components/DrawerFormEvent'


const { Text, Link } = Typography;

import { Table, Tag, Space, Form, Select, Drawer, notification, InputNumber, DatePicker } from 'antd';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
  },
  labelAlign: 'left'
};

const tag_color =  {
  urgent: 'volcano',
  done: 'grey',
  todo: 'geekblue',
  important: 'green',
};

/*

*/

export default class TODO extends PureComponent {
    
    state = {
        data: [],
        loading: false,
        searchText: '',
        searchedColumn: '',
        visible: false,
        visible_bottom: false,
        event_bottom: {
          key: '0',
          title: 'Title',
          deadline: 'year',
          tags: ['todo'],
        }
    }

    getColumnSearchProps = (dataIndex, render_func) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              this.searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.select(), 100);
        }
      },
      render: text =>
        render_func ? (render_func(text)) :
        this.state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });
  
    handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      this.setState({
        searchText: selectedKeys[0],
        searchedColumn: dataIndex,
      });
    };
  
    handleReset = clearFilters => {
      clearFilters();
      this.setState({ searchText: '' });
    };

    componentDidMount() {
      this.setState({ loading: true });
      
      const url = 'http://127.0.0.1:8001/api/get_event/';
      fetch(url)
          .then(res => res.json())
          .then(data => {
            const {results} = data;
            this.setState({
              loading: false,
              data: results
            })            
          });
      /*
      const data = [
          {
            key: '1',
            title: 'Compiler exam',
            deadline: '2020/01/01',
            tags: ['urgent', 'todo'],
          },
          {
            key: '2',
            title: 'GIN',
            deadline: '2019/01/01',
            tags: ['important'],
          },
          {
            key: '3',
            title: 'MPNN',
            deadline: '2020/01/01',
            tags: ['done'],
          },
        ]
        this.setState({
          loading: false,
          data,
        })
        */
    }

    deleteEvent = (key) => {
      const url = 'http://127.0.0.1:8001/api/delete_event/';
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({'id': key}),
      })
      .then(res => res.json())
      .then(res => {
        notification.open({
          message: 'Delete Event Notification',
          description:
            res['message'],
        })
      })
      .then(() => {this.componentDidMount()})
    }

    
    //(authors) => <Space> {authors.map((author) => <a>{author} </a>)} </Space>
    renderTable = () => {
      const columns = [
        {
          title: 'Title',
          dataIndex: 'title',
          key: 'title',
          ...this.getColumnSearchProps('title'),
        },
        {
          title: 'Deadline',
          dataIndex: 'deadline',
          key: 'deadline',
          defaultSortOrder: 'ascend',
          sorter: (a, b) => a.deadline - b.deadline,
          ...this.getColumnSearchProps('deadline'),
        },
        {
          title: 'Tags',
          key: 'tags',
          dataIndex: 'tags',
          ...this.getColumnSearchProps('tags', (tags) => (
            <>
              {tags.map(tag => {
                let color = tag_color[tag];
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          )),
        },
        {
          title: 'Action',
          key: 'action',
          render: (record) => (
            <Space>
              <Button onClick={() => this.showDrawerBottom(record.key)}>
                Edit
              </Button>
              <Button onClick={() => this.deleteEvent(record.key)} danger>
                Delete
              </Button>
            </Space>
          ),
        },
      ];
      const {loading, data} = this.state;
      return (
        <Col span={24}>
          <Table 
              columns={columns} 
              dataSource={data}
              loading={loading}
          />
        </Col>
      )
    }

    handleSubmit = (values) => {
      values['deadline'] = values['deadline'].format('YYYY/MM/DD');
      fetch('http://127.0.0.1:8001/api/add_event/', {
          method: 'POST',
          body: JSON.stringify(values)
      })
      .then(res => res.json())
      .then(res => {
        notification.open({
          message: 'New Event Notification',
          description:
            res['message'],
        });
        this.setState({
          visible: false,
        })
      })
      .then(() => {this.componentDidMount()})
    };

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };

    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    renderDrawer = () => {
      return (
        <Drawer
          title="Add a new event"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" hideRequiredMark onFinish={this.handleSubmit}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Title"
                  rules={[{ required: true, message: 'Please enter the title of the event' }]}
                >
                  <Input placeholder="Please enter the title of the paper" />
                </Form.Item>
              </Col>
            </Row>
              <Col span={12}>
                <Form.Item
                  name="deadline"
                  label="Deadline"
                  rules={[{ required: true, message: 'Please enter the deadline' }]}
                >
                  <DatePicker format={'YYYY/MM/DD'} />
                </Form.Item>
              </Col>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={this.onClose} type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Drawer>)
    }

    //formRef = React.createRef<FormInstance>();

    handleSubmitBottom = (values) => {
      values['deadline'] = values['deadline'].format('YYYY/MM/DD');
      console.log(values)
      fetch('http://127.0.0.1:8001/api/edit_event/', {
          method: 'POST',
          body: JSON.stringify(values)
      })
      .then(res => res.json())
      .then(res => {
        notification.open({
          message: 'Edit Event Notification',
          description:
            res['message'],
        });
        this.setState({
          visible: false,
        })
      })
      .then(() => {this.componentDidMount()})
    };

    showDrawerBottom = (key) => {
      let event;
      console.log(key)
      for (let i in this.state.data) {
        if (this.state.data[i]['key'] == key) {
          event = this.state.data[i];
          break;
        }
      }
      this.setState({
        visible_bottom: true,
        event_bottom: event,
      });
    }

    onCloseBottom = () => {
      this.setState({
        visible_bottom: false,
        event_bottom: {
          key: '0',
          title: 'Title',
          deadline: 'year',
          tags: ['todo'],
        }
      });
    };

    renderDrawerBottom = () => {
      return (
        <DrawerForm
          event={this.state.event_bottom}
          visible={this.state.visible_bottom}
          onClose={this.onCloseBottom}
          onSubmit={this.handleSubmitBottom}
        /> 
      )
    }

    render() {
        return (
            <PageContainer>
                <Row>
                  <Col span={3}>
                    <Button type="primary" onClick={this.showDrawer}>
                      <PlusOutlined /> New event
                    </Button>
                  </Col>
                  {this.renderDrawer()}
                </Row>
                <Row>
                  {this.renderTable()}
                </Row>
                {this.renderDrawerBottom()}
            </PageContainer>
        )
    }
}