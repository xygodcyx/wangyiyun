import type { TFormattingUnitReturnType } from '@/type';
//对名字做...
export const formattingName = (name: string, length: number = 13) => {
  if (name?.length > length) {
    name = name.substring(0, length);
    name += '...';
  }
  return name;
};
//格式化播放量显示单位
export const formattingUnit = (number: number) => {
  let result: TFormattingUnitReturnType = {
    number: 0,
    unit: ''
  };
  let unit = '';
  if (number >= 1000000000000) {
    unit = '兆';
    number = parseFloat((number / 1000000000000).toFixed(1));
  } else if (number >= 100000000) {
    unit = '亿';
    number = parseFloat((number / 100000000).toFixed(1));
  } else if (number >= 10000) {
    unit = '万';
    number = parseFloat((number / 10000).toFixed(1));
  } else {
    unit = '';
  }
  result = {
    number: number,
    unit: unit
  };
  return result;
};
