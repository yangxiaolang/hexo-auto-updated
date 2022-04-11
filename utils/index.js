const fs = require('fs')
const path = require('path')


module.exports.dateFtt= function dateFtt(fmt,date)   
{ 
  var o = {   
    "M+" : date.getMonth()+1,                 //月份   
    "d+" : date.getDate(),                    //日   
    "h+" : date.getHours(),                   //小时   
    "m+" : date.getMinutes(),                 //分   
    "s+" : date.getSeconds(),                 //秒   
    "q+" : Math.floor((date.getMonth()+3)/3), //季度   
    "S"  : date.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
} 

module.exports.debounce= function debounce(func,delay){
    let id
    return (...arg)=>{
        if(id){
            clearTimeout(id)
        }
    
        id = setTimeout(()=>{
            func(...arg)
        },delay)
    }
}

module.exports.throttor= function throttor(func,delay){
    let isExcuted=false
    return (...arg)=>{
        if(!isExcuted){
            isExcuted=true
            setTimeout(()=>{
                isExcuted=false
            },delay)
            func(...arg)
        }
    }
}

module.exports.loadUpdated = function () {
  const updatedMap = new Map()
  const filenames = fs.readdirSync(path.resolve('source/_posts'))
  // console.log(filenames)
  filenames.forEach(filename => {
      const content = fs.readFileSync(path.resolve('source/_posts', filename)).toString()
      const matchArray = /updated: ([1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d)/g.exec(content)
      if (matchArray !== null) {
          const updatedTime = matchArray[1]
          // console.log(filename, updatedTime)
          updatedMap.set(filename, updatedTime)
      } else {
          updatedMap.set(filename, null)
      }
  })
  return updatedMap
}