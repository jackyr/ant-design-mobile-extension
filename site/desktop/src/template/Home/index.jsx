import 'react-github-button/assets/style.css';
import React from 'react';
import DocumentTitle from 'react-document-title';
import { Link } from 'bisheng/router';
import GitHubButton from 'react-github-button';
import { injectIntl } from 'react-intl';
import { Popover, Button } from 'antd';
import * as utils from '../../../../utils';

function getStyle() {
  return `
    .main-wrapper {
      padding: 0;
    }
    #header {
      box-shadow: none;
      width: 100%;
    }
    #header,
    #header .ant-select-selection,
    #header .ant-menu {
      background: transparent;
    }
    #footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }    
  `;
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    const { pathname } = props.location;
    const isZhCN = utils.isZhCN(pathname);
    this.state = {
      isZhCN,
    };
  }

  render() {
    const { isZhCN } = this.state;

    return (
      <DocumentTitle title={`Ant Design Mobile Extension - ${this.props.intl.formatMessage({ id: 'app.home.slogan' })}`}>
        <div className="main-wrapper">
          <section className="home-s1">
            <div className="banner-wrapper">
              <div className="banner-text-wrapper">
                <h2 key="h2">Ant Design Mobile<br />Extension</h2>
                <p>{this.props.intl.formatMessage({ id: 'app.home.epitomize' })}</p>
                <div key="button1" className="start-button">
                  <Link to={`/docs/react/introduce${isZhCN ? '-cn' : ''}`}>
                    <Button type="primary" size="large">
                      {this.props.intl.formatMessage({ id: 'app.home.centerStart' })}
                    </Button>
                  </Link>
                  <Popover
                    placement="bottom"
                    trigger="click"
                    content={
                      <img className="home-qr" src="https://zos.alipayobjects.com/rmsportal/TrdkqxQcrAUcmYelQUNK.png" alt="qrcode" />
                    }
                  >
                    <Button type="primary" ghost>
                      {this.props.intl.formatMessage({ id: 'app.home.qrtip' })}
                    </Button>
                  </Popover>
                  <GitHubButton
                    key="github-button"
                    type="stargazers"
                    namespace="jackyr"
                    repo="ant-design-mobile-extension"
                  />
                </div>
              </div>
            </div>
          </section>
          <style dangerouslySetInnerHTML={{ __html: getStyle() }} />
        </div>
      </DocumentTitle>
    );
  }
}

export default injectIntl(Home);
