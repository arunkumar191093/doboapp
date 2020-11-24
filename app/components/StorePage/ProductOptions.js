import React from 'react';
import InfoComponent from '../Common/InfoComponent';
import SquareButtons from '../Common/SquareButtons';

const ProductOptions = ({
  productSizes = [],
  productColors = [],
  productQty = [],
  selectedSize= '',
  selectedColor= '',
  selectedQty= 0,
  onSizeSelect = () => { },
  onColorSelect = () => { },
  onQtySelect = () => { },
}) => {
  return (
    <>
      <InfoComponent heading="Select Size">
        <SquareButtons items={productSizes} name="size.dimensions" selectedItem={selectedSize} onClick={(item) => onSizeSelect(item)} />
      </InfoComponent>
      <InfoComponent heading="Available Colors">
        <SquareButtons items={productColors} name="color.colorCode" isBgColor={true} selectedItem={selectedColor} onClick={(item) => onColorSelect(item)} />
      </InfoComponent>
      <InfoComponent heading="Quantity">
        <SquareButtons items={productQty} selectedItem={selectedQty} onClick={(item) => onQtySelect(item)} />
      </InfoComponent>
    </>
  )
}

export default ProductOptions;