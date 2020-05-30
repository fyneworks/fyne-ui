export const n = s => parseFloat(s) || 0;

export const calculateTotal = items => {
  //console.log('calculateTotal', {items});
  let grand_total = 0;
  items.forEach(item=>{
    //console.log('calculateTotal LOOP item', {item});
    
    let line_total = lineTotal(item);
    grand_total += line_total;

    //console.log('calculateTotal LOOP item DONE', {line_total,grand_total});
  })
  //console.log('calculateTotal DONE', {grand_total});
  return n(parseFloat(grand_total).toFixed(2));
}
export const lineTotal = item => {
  //console.log('calculateTotal lineTotal item', {item});
  if(!item.price) return 0;
  let line_quant = n(item.quantity) || 1;
  let line_magni = n(item.magnitude);
  let line_price = n(item.price.fixprice);
  let line_subto = line_magni * line_price;
  let line_surch = line_subto * (n(item.model.varprice)/100);
  let line_total = line_subto + line_surch;
  let line_final = line_quant * line_total;
  //console.log('calculateTotal lineTotal item DONE', {item,line_quant,line_magni,line_price,line_subto,line_surch,line_total,line_final});
  return n(parseFloat(line_final).toFixed(2));
}
