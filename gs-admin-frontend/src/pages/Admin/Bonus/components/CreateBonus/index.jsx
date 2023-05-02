import {
  Tabs,
  Tab,
  Row,
  Col,
  Form as BForm
} from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import React from 'react'
import GeneralForm from './general'
import useCreateBonus from '../hooks/useCreateBonus'
import CurrenciesForm from './currencies'
import { bonusSchema } from './schema'
import { tabLabels } from './constants'
import { formatDate } from '../../../../../utils/dateFormatter'
import Games from './Games'
import Preloader from '../../../../../components/Preloader'
import Languages from './Languages'

const CreateBonus = () => {
  const {
    curr,
    setCurr,
    selectedTab,
    setSelectedTab,
    state,
    setState,
    preview,
    handleImagePreview,
    setActiveTab,
    dispatch,
    navigate,
    enableSubmit,
    setEnableSubmit,
    loading,
    handelCreateBonus,
    pageNo,
    setPageNo,
    limit,
    setLimit,
    totalPages,
    search,
    setSearch,
    selectedProvider,
    setSelectedProvider,
    gameIds,
    setGameIds,
    casinoGamesData,
    gamesLimit,
    gamesPageNo,
    setGamesLimit,
    setGamesPageNo,
    appliedBonusOptions,
    languages,
    data,
    setData
  } = useCreateBonus()

  return (
    <>
      <Row>
        {loading && <Preloader />}

        <Col>
          <h3>Create Bonus </h3>
        </Col>
      </Row>
      <Formik
        initialValues={{
          promotionTitle: '',
          bonusType: 'joining',
          validFrom: formatDate(state?.[0].startDate),
          validTo: formatDate(state?.[0].endDate),
          termCondition: '',
          quantity: 1,
          wageringMultiplier: 1,
          currency: {
            EUR: {
              maxBonusThreshold: '',
              minDeposit: '',
              maxWinAmount: '',
              zeroOutThreshold: '',
              minBalance: ''
            }
          },
          providers: '',
          daysToClear: 1,
          games: '',
          maxBonusThreshold: '',
          status: '',
          minDeposit: '',
          maxWinAmount: '',
          isWinCashAmt: '',
          depositBonusPercent: 1,
          isMultipleAllowed: '',
          validOnDays: [],
          bonusImage: null,
          isActive: false,
          allowAboveZero: false,
          visibleInPromotions: false,
          isSticky: false,
          paymentMethods: {},
          appliedBonusId: '',
          appliedBonusVal: '',
          adminId: '',
          description: '',
          loyaltyLevel: null,
          other: null,
          minBalance: '',
          betLevel: 1
        }}
        validationSchema={
          bonusSchema(curr, { bonusDetail: null })[
            tabLabels.findIndex((val) => val === selectedTab)
          ]
        }
        onSubmit={(formValues) => handelCreateBonus(formValues)}
      >
        {({
          touched,
          errors,
          values,
          setSubmitting,
          handleChange,
          handleSubmit,
          handleBlur,
          setFieldValue
        }) => (
          <BForm>
            <Tabs
              key={selectedTab}
              activeKey={selectedTab}
              className='nav-light'
              mountOnEnter
              unmountOnExit
              onSelect={(k) => setSelectedTab(k)}
            >
              <Tab disabled eventKey='general' title='General'>
                <div className='mt-5'>
                  <GeneralForm
                    state={state}
                    setState={setState}
                    setSelectedTab={setSelectedTab}
                    touched={touched}
                    errors={errors}
                    values={values}
                    setSubmitting={setSubmitting}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    preview={preview}
                    handleImagePreview={handleImagePreview}
                    navigate={navigate}
                    setGameIds={setGameIds}
                    setEnableSubmit={setEnableSubmit}
                    appliedBonusOptions={appliedBonusOptions}
                    data={data}
                    setData={setData}
                  />
                </div>
              </Tab>
              {languages?.rows?.length > 1 &&
                <Tab disabled eventKey='languages' title='Languages'>
                  <div className='mt-5'>
                    <Languages
                      languages={languages}
                      handleSubmit={handleSubmit}
                      setSelectedTab={setSelectedTab}
                      selectedTab={selectedTab}
                      data={data}
                      setData={setData}
                      values={values}
                      create
                    />
                  </div>
                </Tab>}
              
                <Tab disabled eventKey='currency' title='Currency'>
                  <div className='mt-5'>
                    <CurrenciesForm
                      touched={touched}
                      errors={errors}
                      values={values}
                      setSubmitting={setSubmitting}
                      handleChange={handleChange}
                      handleSubmit={handleSubmit}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      setCurr={setCurr}
                      setSelectedTab={setSelectedTab}
                      setActiveTab={setActiveTab}
                      enableSubmit={enableSubmit}
                      setEnableSubmit={setEnableSubmit}
                      languages={languages}
                    />
                  </div>
                </Tab>

              {(values.bonusType === 'freespins' || values?.bonusType === 'cashfreespins') && (
                <Tab disabled eventKey='games' title='Games'>
                  <div className='mt-5'>
                    <Games
                      gameIds={gameIds}
                      setGameIds={setGameIds}
                      setLimit={setGamesLimit}
                      setPageNo={setGamesPageNo}
                      setSearch={setSearch}
                      search={search}
                      totalPages={totalPages}
                      limit={gamesLimit}
                      pageNo={gamesPageNo}
                      loading={loading}
                      handleSubmit={handleSubmit}
                      handleBlur={handleBlur}
                      casinoGamesData={casinoGamesData}
                      selectedProvider={selectedProvider}
                      setSelectedProvider={setSelectedProvider}
                      setSelectedTab={setSelectedTab}
                      values={values}
                    />
                  </div>
                </Tab>
              )}
            </Tabs>
          </BForm>
        )}
      </Formik>
    </>
  )
}

export default CreateBonus
