import React from 'react'
import { Col, Row, Image, Container } from '@themesberg/react-bootstrap'

import NotFoundImage from '../../assets/img/illustrations/404.svg'

export default () => {
  return (
    <main>
      <section className='vh-100 d-flex align-items-center justify-content-center'>
        <Container>
          <Row>
            <Col
              xs={12}
              className='text-center d-flex align-items-center justify-content-center'
            >
              <div>
                {/* <Card.Link as={Link} to={Routes.DashboardOverview}> */}
                <Image src={NotFoundImage} className='img-fluid w-75' />
                {/* </Card.Link> */}
                <h1 className='text-primary mt-5'>
                  Page not <span className='fw-bolder'>found</span>
                </h1>
                <p className='lead my-4'>
                  Oops! Looks like you followed a bad link. If you think this is
                  a problem with us, please tell us.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  )
}
