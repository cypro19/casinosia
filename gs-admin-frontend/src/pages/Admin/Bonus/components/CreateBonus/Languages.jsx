import { Button, Tab, Tabs } from '@themesberg/react-bootstrap'
import React, { useState } from 'react'
import MultiLanguage from './MultiLanguage'
import Parser from 'html-react-parser'

const Languages = ({
  languages,
  handleSubmit,
  setSelectedTab,
  data,
  setData,
  values,
  create = false
}) => {
  const [selectedLang, setSelectedLang] = useState((languages?.rows?.[0]?.code === 'EN' ? languages?.rows?.[1]?.code : languages?.rows?.[0]?.code) || '')

  const checkAllEmptyCondition = () => {
    return ((data?.promoTitle?.[selectedLang] === '' || data?.promoTitle?.[selectedLang] === undefined) &&
    (data?.desc?.[selectedLang] === '' || data?.desc?.[selectedLang] === undefined) &&
    (data?.terms?.[selectedLang] === '' ||
    data?.terms?.[selectedLang] === undefined ||
    (data?.terms?.[selectedLang] && (!data?.terms?.[selectedLang]?.replace(/<[^>]+>/g, '')?.length))
    ))
  }

  const checkAllFilled = () => {
    return (data?.promoTitle?.[selectedLang] &&
      data?.desc?.[selectedLang] &&
      (data?.terms?.[selectedLang] && (data?.terms?.[selectedLang]?.replace(/<[^>]+>/g, '')?.length)))
  }

  return (
    <>
      <Tabs
        activeKey={selectedLang}
        onSelect={(tab) => setSelectedLang(tab)}
        className='nav-light mt-3'
      >
        {languages?.rows?.length && languages?.rows?.map((lang) => {
          const code = lang.code
          return code !== 'EN' && (
            <Tab
              eventKey={code}
              title={code}
              key={code}
              mountOnEnter
              disabled={!(checkAllFilled() || checkAllEmptyCondition())}
              tabClassName={selectedLang !== code ? (data?.promoTitle?.[code] !== undefined && data?.promoTitle?.[code] !== '') ? 'email' : '' : 'email-active'}
            >
              <div className='mt-5'>
                <MultiLanguage
                  selectedLang={selectedLang}
                  data={data}
                  setData={setData}
                />
              </div>
            </Tab>
          )
        })}
      </Tabs>
      <div className='mt-3 d-flex justify-content-between'>
        <Button
          variant='warning'
          onClick={() => setSelectedTab('general')}
          disabled={!(checkAllFilled() || checkAllEmptyCondition())}
        >Previous
        </Button>
        <Button
          variant='success'
          onClick={handleSubmit}
          disabled={!(checkAllFilled() || checkAllEmptyCondition())}
        >{'Next'}
        </Button>
      </div>
    </>
  )
}

export default Languages
