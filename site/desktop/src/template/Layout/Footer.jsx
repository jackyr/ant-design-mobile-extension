import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col } from 'antd';

const Footer = () => (
  <footer id="footer" className="dark">
    <Row className="bottom-bar">
      <Col lg={4} sm={24} />
      <Col lg={20} sm={24}>
        <span style={{ marginRight: 12 }}>Copyright © <a href="https://github.com/jackyr"><FormattedMessage id="app.footer.author" /></a></span>
      </Col>
    </Row>
  </footer>
);

export default injectIntl(Footer);
