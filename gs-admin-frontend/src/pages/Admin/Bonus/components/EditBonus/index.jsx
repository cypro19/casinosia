import {
  Tabs,
  Tab,
  Row,
  Col,
  Form as BForm
} from '@themesberg/react-bootstrap'
import { Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import GeneralForm from '../CreateBonus/general'
import useCreateBonus from '../hooks/useCreateBonus'
import CurrenciesForm from '../CreateBonus/currencies'
import { updateBonusStart } from '../../../../../store/redux-slices/bonus'
import { formatDateYMD } from '../../../../../utils/dateFormatter'
import useEditBonus from '../hooks/useEditBonus'
import Preloader from '../../../../../components/Preloader'
import { tabLabels } from '../CreateBonus/constants'
import { bonusSchema } from '../CreateBonus/schema'
import Games from '../CreateBonus/Games'
import { toast } from '../../../../../components/Toast'
import Languages from '../CreateBonus/Languages'

const EditBonus = () => {
  const {
    selectedTab,
    setSelectedTab,
    state,
    dispatch,
    bonusDetail,
    bonusId,
    loading,
    navigate,
    setState
  } = useEditBonus()
  const {
    handleImagePreview,
    preview,
    activeTab,
    setActiveTab,
    setCurr,
    enableSubmit,
    setEnableSubmit,
    pageNo,
    setPageNo,
    limit,
    setLimit,
    totalPages,
    gameIds,
    setGameIds,
    search,
    setSearch,
    casinoGamesData,
    selectedProvider,
    setSelectedProvider,
    gamesLimit,
    gamesPageNo,
    setGamesLimit,
    setGamesPageNo,
    appliedBonusOptions,
    languages,
    data,
    setData,
    set
  } = useCreateBonus(bonusDetail)
  const [loyaltyCount, setLoyaltyCount] = useState(1)
  return (
    <>
      <Row>
        <Col>
          <h3>Edit Bonus: {bonusDetail?.promotionTitle?.EN} </h3>
        </Col>
      </Row>
      {!loading && set
        ? (
          <Formik
            enableReinitialize
            initialValues={{
              promotionTitle: bonusDetail?.promotionTitle?.EN || '',
              bonusType: bonusDetail?.bonusType || '',
              validFrom: bonusDetail?.validFrom || state.startDate,
              validTo: bonusDetail?.validTo || state.endDate,
              termCondition: bonusDetail?.termCondition?.EN || '',
              quantity: bonusDetail?.quantity || 0,
              daysToClear: bonusDetail?.daysToClear || 0,
              currency: bonusDetail?.currency || {},
              maxBonusThreshold: '',
              status: bonusDetail?.status || '',
              minDeposit: '',
              maxWinAmount: '',
              isWinCashAmt: '',
              depositBonusPercent: bonusDetail?.depositBonusPercent,
              adminId: bonusDetail?.adminId,
              validOnDays: bonusDetail?.validOnDays,
              bonusImage: null,
              isActive: bonusDetail?.isActive || false,
              allowAboveZero: bonusDetail?.allowAboveZero || false,
              visibleInPromotions: bonusDetail?.visibleInPromotions || false,
              isSticky: bonusDetail?.isSticky || false,
              wageringMultiplier: bonusDetail?.wageringMultiplier || 1,
              paymentMethods: bonusDetail?.paymentMethods || {},
              appliedBonusId: '',
              appliedBonusVal: bonusDetail?.appliedBonusId,
              description: bonusDetail?.description?.EN || '',
              loyaltyLevel: bonusDetail?.other?.loyaltyLevel || [{}],
              minBalance: '',
              timePeriod: bonusDetail?.timePeriod || '1',
              other: bonusDetail?.other?.loyaltyLevel || null,
              betLevel: bonusDetail?.other?.betLevel || 1
            }}
            validationSchema={
            bonusSchema(bonusDetail?.currency, { bonusDetail })[tabLabels.findIndex((val) => val === selectedTab)]
          }
            onSubmit={(formValues) => {
              Object.keys(formValues).forEach((key) => {
                if (formValues[key] === null || formValues[key] === '') {
                  delete formValues[key]
                }
              })
              if (formValues.bonusType === 'freespins') {
                if (selectedTab === 'games') {
                  delete formValues?.loyaltyLevel
                  formValues.gameIds = gameIds
                  formValues.promotionTitle = JSON.stringify(data?.promoTitle)
                  formValues.description = JSON.stringify(data?.desc)
                  formValues.termCondition = JSON.stringify(data?.terms)
                  gameIds && gameIds?.length
                    ? dispatch(
                      updateBonusStart({
                        data: {
                          ...formValues,
                          bonusId,
                          validFrom: formatDateYMD(state.map((a) => a.startDate)),
                          validTo: formatDateYMD(state.map((a) => a.endDate)),
                          other: { betLevel: formValues?.betLevel }
                        },
                        navigate
                      })
                    )
                    : toast('Select At least One Game.', 'error')
                } else {
                  setSelectedTab(selectedTab === 'general' ? (languages?.rows?.length > 1) ? 'languages' : 'currency' : (selectedTab === 'languages' ? 'currency' : selectedTab === 'currency' && (formValues?.isSticky === 'true' || formValues?.isSticky) ? 'games' : 'games'))
                }
              } else {
                if (formValues.bonusType === 'joining') {
                  if (selectedTab === 'currency') {
                    formValues.promotionTitle = JSON.stringify(data?.promoTitle)
                    formValues.description = JSON.stringify(data?.desc)
                    formValues.termCondition = JSON.stringify(data?.terms)
                    dispatch(
                      updateBonusStart({
                        data: {
                          ...formValues,
                          bonusId,
                          validFrom: formatDateYMD(state.map((a) => a.startDate)),
                          validTo: formatDateYMD(state.map((a) => a.endDate)),
                          appliedBonusId: formValues.appliedBonusVal
                        },
                        navigate
                      })
                    )
                  } else {
                    setSelectedTab(selected => selected === 'general' ? (languages?.rows?.length > 1) ? 'languages' : 'currency' : (selected === 'languages' && 'currency'))
                  }
                } else {
                  if (formValues.bonusType === 'deposit' && selectedTab === 'currency') {
                    formValues.promotionTitle = JSON.stringify(data?.promoTitle)
                    formValues.description = JSON.stringify(data?.desc)
                    formValues.termCondition = JSON.stringify(data?.terms)
                    dispatch(
                      updateBonusStart({
                        data: {
                          ...formValues,
                          bonusId,
                          validFrom: formatDateYMD(state.map((a) => a.startDate)),
                          validTo: formatDateYMD(state.map((a) => a.endDate))
                        },
                        navigate
                      })
                    )
                  } else {
                    setActiveTab(
                      tabLabels.findIndex((val) => val === selectedTab) + 1
                    )
                    setSelectedTab(selected => selected === 'general' ? (languages?.rows?.length > 1) ? 'languages' : 'currency' : (selected === 'languages' && 'currency' ))
                  }
                }
              }
            }}
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
                  onSelect={(k) => setSelectedTab(k)}
                  mountOnEnter
                  unmountOnExit
                >
                  <Tab disabled eventKey='general' title='General'>
                    <div className='mt-5'>
                      <GeneralForm
                        state={state}
                        setState={setState}
                        isEdit
                        setSelectedTab={setSelectedTab}
                        touched={touched}
                        errors={errors}
                        values={values}
                        setSubmitting={setSubmitting}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        bonusDetail={bonusDetail}
                        handleImagePreview={handleImagePreview}
                        preview={preview}
                        navigate={navigate}
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
                        />
                      </div>
                    </Tab>}
                  {(
                    <Tab disabled eventKey='currency' title='Currency'>
                      <div className='mt-5'>
                        <CurrenciesForm
                          isEdit
                          enableSubmit={enableSubmit}
                          setEnableSubmit={setEnableSubmit}
                          touched={touched}
                          errors={errors}
                          values={values}
                          setSubmitting={setSubmitting}
                          handleChange={handleChange}
                          handleSubmit={handleSubmit}
                          handleBlur={handleBlur}
                          setFieldValue={setFieldValue}
                          setCurr={setCurr}
                          bonusDetail={bonusDetail}
                          setSelectedTab={setSelectedTab}
                          setActiveTab={setActiveTab}
                        />
                      </div>
                    </Tab>
                  )}

                  {(values.bonusType === 'freespins') && (
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
                          handleSubmit={handleSubmit}
                          handleBlur={handleBlur}
                          casinoGamesData={casinoGamesData}
                          selectedProvider={selectedProvider}
                          setSelectedProvider={setSelectedProvider}
                          setSelectedTab={setSelectedTab}
                          isEdit
                          values={values}
                        />
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </BForm>
            )}
          </Formik>
          )
        : (
          <Preloader />
          )}
    </>
  )
}

export default EditBonus
