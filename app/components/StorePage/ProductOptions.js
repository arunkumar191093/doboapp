import React from 'react';
import InfoComponent from '../Common/InfoComponent';
import SquareButtons from '../Common/SquareButtons';
import * as Constants from '../../services/Constants';

const ProductOptions = ({
  productSizes = [],
  productColors = [],
  productQty = [],
  returnproductQty = [],
  selectedSize = '',
  selectedColor = '',
  selectedQty = 0,
  selectedReturnQty = 0,
  onSizeSelect = () => { },
  onColorSelect = () => { },
  onQtySelect = () => { },
  isReturnFlow = false
}) => {
  return (
    <>
      {
        !isReturnFlow &&
        <>
          <InfoComponent heading="Available Sizes">
            <SquareButtons items={productSizes} name="size.dimensions" selectedItem={selectedSize} onClick={!isReturnFlow ? (item) => onSizeSelect(item) : () => { }} />
          </InfoComponent>
          <InfoComponent heading="Available Colors">
            <SquareButtons items={productColors} name="color.colorCode" isBgColor={true} selectedItem={selectedColor} onClick={!isReturnFlow ? (item) => onColorSelect(item) : () => { }} />
          </InfoComponent>
        </>
      }
      {
        // Constants.SHOW_FEATURE &&
        <InfoComponent heading="Quantity">
          {
            isReturnFlow ?
              <SquareButtons items={returnproductQty} selectedItem={selectedReturnQty} onClick={selectedReturnQty <= selectedQty ? (item) => onQtySelect(item) : () => { }} /> :
              <SquareButtons items={productQty} selectedItem={selectedQty} onClick={(item) => onQtySelect(item)} />
          }
        </InfoComponent>
      }
    </>
  )
}

export default ProductOptions;