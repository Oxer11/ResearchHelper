import React, { PureComponent } from 'react';
import { Typography, Card, Pagination, Row, Col, Tabs } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

const { Text, Link } = Typography;

export default class Projects extends PureComponent {
    state = {
        pages: [],
        pagination: 1
    }

    componentDidMount() {
        //const url = `${ROOT}?num=1000`
        /*
        const url = 'http://127.0.0.1:8001/api/news/';
        fetch(url)
            .then(res => res.json())
            .then(data => {
                const pages = [];
                const {results} = data;
                for (let i = 0; i < results.length; i += 10) {
                    const page = [];
                    for (let j = i; j < i + 10; j += 1) {
                        page.push(results[j]);
                    }
                    pages.push(page);
                }
                this.setState({
                    pages
                })
            });
        */
       const pages = [[{
        title: 'Multi-Task Learning',
        github: 'https://github.com/chao1224/KG_augmented_MTL',
        overleaf: 'https://www.overleaf.com/project/5fa81033da3e220739913b25',
        google_doc: 'https://docs.google.com/document/u/1/d/1_NPoOG8PmQ9zf1OX3v0mPKEEjAF3_0ZTlbLbwXr29_E/edit',
        related_papers: [],
       }, {
        title: 'Drug Repurposing',
        github: 'https://github.com/KiddoZhu/SubgraphCloseness',
        overleaf: 'https://www.overleaf.com/project/5fa81033da3e220739913b25',
        google_doc: 'https://docs.google.com/document/u/1/d/1_NPoOG8PmQ9zf1OX3v0mPKEEjAF3_0ZTlbLbwXr29_E/edit',
        related_papers: [],
       }]]
       this.setState({
         pages
       })
    }

    renderSingleProject = (project) => {
        const { title, overleaf, github, google_doc, related_papers } = project
        return (
            <Col span={12}>
                <Card
                    bordered={false}
                    hoverable
                    title= { title }
                >
                  <Link href={overleaf} target="_blank" strong> Overleaf </Link>
                  <Link href={github} target="_blank" strong> Github </Link>
                </Card>
                <p />
                <p />
            </Col>
        )

    }

    renderAllProjects = () => {
        const page = this.state.pagination;
        const projects = this.state.pages[page - 1];
        const allNews = projects ? projects.map((value) => {
            return (this.renderSingleProject(value))
        }) : []
        return allNews
    }

    handleChange = (page) => {
        this.setState({
            pagination: page
        })
    }

    renderPagination = () => {
        return (
          <Col span={12} offset={12}>
            <Pagination 
            showQuickJumper 
            showSizeChanger={ false }
            defaultCurrent={1} 
            total={ this.state.pages.length * 10 } 
            onChange={ (page) => this.handleChange(page) }
            style={ {float: 'right'} }/>
          </Col>
        )
    }

    render() {
        return (
            <PageContainer>
                <Row gutter={[24, 8]}>
                  {this.renderAllProjects()}
                </Row>
                <Row>
                  {this.renderPagination()}
                </Row>
            </PageContainer>
        )
    }
}