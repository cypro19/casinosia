import React from 'react'
import CreateCurrencies from './CreateCurrencies'
import Preloader from '../../../../components/Preloader'
import useEditCurrency from '../hooks/useEditCurrency'

const UpdateCurrency = () => {
  const { currencyId, currency, loading } = useEditCurrency()

  return (
    <>
      {loading
        ? <Preloader />
        : (
          <>
            {currency && currency.currencyId === JSON.parse(currencyId) && (
              <CreateCurrencies
                currencyId={currency.currencyId}
                name={currency.name}
                code={currency.code}
                exchangeRate={currency.exchangeRate}
                symbol={currency.symbol}
                type={currency.type}
                isPrimary={currency.isPrimary}
                loyaltyPoint={currency.loyaltyPoint}
              />
            )}
          </>
          )}
    </>
  )
}

export default UpdateCurrency
