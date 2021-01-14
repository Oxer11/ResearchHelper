import React, { PureComponent } from 'react';
import { Typography, Card, Pagination, Row, Col, Tabs, Input, Button } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { FormInstance } from 'antd/lib/form';
import DrawerForm from './components/DrawerForm'


const { Text, Link } = Typography;

import { Table, Tag, Space, Form, Select, Drawer, notification, InputNumber } from 'antd';

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
  todo: 'volcano',
  never: 'grey',
  scanned: 'geekblue',
  read: 'green',
};

/*
const data = [
  {
    key: '1',
    title: 'GCN',
    year: 2020,
    conf: 'Neurips',
    url: 'https://www.baidu.com',
    authors: ['Keyulu Xu', 'Weihua Hu', 'Jure Leskovec', 'Stefanie Jegelka'],
    abstract: 'Dropout has been witnessed with great success in training deep neural networks by independently zeroing out the outputs of neurons at random. It has also received a surge of interest for shallow learning, e.g., logistic regression. However, the independent sampling for dropout could be suboptimal for the sake of convergence. In this paper, we propose to use multinomial sampling for dropout, i.e., sampling features or neurons according to a multinomial distribution with different probabilities for different features/neurons. To exhibit the optimal dropout probabilities, we analyze the shallow learning with multinomial dropout and establish the risk bound for stochastic optimization. By minimizing a sampling dependent factor in the risk bound, we obtain a distribution-dependent dropout with sampling probabilities dependent on the second order statistics of the data distribution. To tackle the issue of evolving distribution of neurons in deep learning, we propose an efficient adaptive dropout (named \textbf{evolutional dropout}) that computes the sampling probabilities on-the-fly from a mini-batch of examples. Empirical studies on several benchmark datasets demonstrate that the proposed dropouts achieve not only much faster convergence and but also a smaller testing error than the standard dropout. For example, on the CIFAR-100 data, the evolutional dropout achieves relative improvements over 10\% on the prediction performance and over 50\% on the convergence speed compared to the standard dropout.',
    tags: ['scanned', 'todo'],
  },
  {
    key: '2',
    title: 'GIN',
    year: 2019,
    conf: 'ICML',
    authors: ['Keyulu Xu', 'Weihua Hu', 'Jure Leskovec', 'Stefanie Jegelka'],
    url: 'https://www.baidu.com',
    tags: ['never'],
  },
  {
    key: '3',
    title: 'MPNN',
    year: 2017,
    conf: 'ICML',
    authors: ['Keyulu Xu', 'Weihua Hu', 'Jure Leskovec', 'Stefanie Jegelka'],
    url: 'https://www.baidu.com',
    tags: ['read'],
  },
]
*/

export default class Papers extends PureComponent {
    
    state = {
        data: [],
        loading: false,
        searchText: '',
        searchedColumn: '',
        visible: false,
        visible_bottom: false,
        paper_bottom: {
          key: '0',
          title: 'Title',
          url: 'URL',
          author: 'Author',
          conf: 'Conf',
          year: 'year',
          tags: ['todo'],
          authors: 'Authors',
          abstract: 'Abstract',
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
      
      const url = 'http://127.0.0.1:8001/api/get_paper/';
      fetch(url)
          .then(res => res.json())
          .then(data => {
            const {results} = data;
            this.setState({
              loading: false,
              data: results
            })            
          });
    }

    deletePaper = (key) => {
      console.log(key)
      const url = 'http://127.0.0.1:8001/api/delete_paper/';
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({'id': key}),
      })
      .then(res => res.json())
      .then(res => {
        notification.open({
          message: 'Delete Paper Notification',
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
          //dataIndex: 'title',
          key: 'title',
          ...this.getColumnSearchProps('title', (record) => <Link href={record.url} target="_blank">{record.title}</Link>),
        },
        {
          title: 'Conference',
          dataIndex: 'conf',
          key: 'conf',
          ...this.getColumnSearchProps('conf'),
        },
        {
          title: 'Year',
          dataIndex: 'year',
          key: 'year',
          defaultSortOrder: 'descend',
          sorter: (a, b) => a.year - b.year,
          ...this.getColumnSearchProps('year'),
        },
        {
          title: 'Author',
          dataIndex: 'authors',
          key: 'authors',
          ...this.getColumnSearchProps('authors'),
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
              <Button onClick={() => this.deletePaper(record.key)} danger>
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
              expandable={{
                  expandedRowRender: record => <p style={{ margin: 0 }}>{record.abstract}</p>,
                  //rowExpandable: record => record.name !== 'Not Expandable',
                }}
          />
        </Col>
      )
    }

    handleSubmit = (values) => {
        fetch('http://127.0.0.1:8001/api/add_paper/', {
            method: 'POST',
            body: JSON.stringify(values)
        })
        .then(res => res.json())
        .then(res => {
          notification.open({
            message: 'New Paper Notification',
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
          title="Add a new paper"
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
                  rules={[{ required: true, message: 'Please enter the title of the paper' }]}
                >
                  <Input placeholder="Please enter the title of the paper" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="url"
                  label="Url"
                  rules={[{ required: false, message: 'Please enter url' }]}
                >
                  <Input
                    style={{ width: '100%' }}
                    addonBefore="https://"
                    placeholder="Please enter url"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="conf"
                  label="Conference"
                  rules={[{ required: true, message: 'Please enter the conference' }]}
                >
                  <Input placeholder="Please enter the conference" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="year"
                  label="Year"
                  rules={[{ required: true, message: 'Please enter the published year' }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="authors"
                  label="Authors"
                  rules={[{ required: true, message: 'Please enter the authors' }]}
                >
                  <Input placeholder="Please enter the authors (split by ',')" />
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
                >
                  <Input.TextArea rows={4} placeholder="please enter the abstract" />
                </Form.Item>
              </Col>
            </Row>
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
      console.log(values)
      fetch('http://127.0.0.1:8001/api/edit_paper/', {
          method: 'POST',
          body: JSON.stringify(values)
      })
      .then(res => res.json())
      .then(res => {
        notification.open({
          message: 'Edit Paper Notification',
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
      let paper;
      console.log(key)
      for (let i in this.state.data) {
        if (this.state.data[i]['key'] == key) {
          paper = this.state.data[i];
          break;
        }
      }
      console.log(paper);
      //const {title, url, conf, year, authors, tags, abstract} = paper;
      //console.log(this.formRef);
      //this.formRef.current!.setFieldsValue(paper);
      this.setState({
        visible_bottom: true,
        paper_bottom: paper,
      });
    }

    onCloseBottom = () => {
      this.setState({
        visible_bottom: false,
        paper_bottom: {
          key: '0',
          title: 'Title',
          url: 'URL',
          author: 'Author',
          conf: 'Conf',
          year: 'year',
          tags: ['todo'],
          authors: 'Authors',
          abstract: 'Abstract',
        }
      });
    };

    renderDrawerBottom = () => {
      return (
        <DrawerForm
          paper={this.state.paper_bottom}
          visible={this.state.visible_bottom}
          onClose={this.onCloseBottom}
          onSubmit={this.handleSubmitBottom}
        /> 
      )
    }

    handleImport = (values) => {
      console.log(values)
      fetch('http://127.0.0.1:8001/api/import_paper/', {
          method: 'POST',
          body: JSON.stringify(values)
      })
      .then(res => res.json())
      .then(res => {
        notification.open({
          message: 'Import Paper Notification',
          description:
            res['message'],
        })
      })
      .then(() => {this.componentDidMount()})
      notification.open({
        message: 'Import Paper Notification',
        description:
          'Submitted job',
      });
    }

    render() {
        return (
            <PageContainer>
                <Row>
                  <Col span={3}>
                    <Button type="primary" onClick={this.showDrawer}>
                      <PlusOutlined /> New paper
                    </Button>
                  </Col>
                  <Col span={12} offset={8}>
                      <Form layout="horizontal" hideRequiredMark onFinish={this.handleImport}>
                        <Row gutter={16}>
                          <Col span={10}>
                            <Form.Item
                              name="conf"
                              label="Conference"
                              rules={[{ required: true, message: 'Please select the conference' }]}
                              initialValue="icml"
                            >
                              <Select>
                                <Option value="neurips">Neurips</Option>
                                <Option value="iclr">ICLR</Option>
                                <Option value="icml">ICML</Option>
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={10}>
                            <Form.Item
                              name="year"
                              label="Year"
                              rules={[{ required: true, message: 'Please enter the published year' }]}
                              initialValue={2020}
                            >
                              <InputNumber />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button type="primary" htmlType="submit">
                                <PlusOutlined /> Import paper
                            </Button>
                          </Col>
                        </Row> 
                      </Form>
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