import { useCallback, useMemo, useState } from 'react';

// 복수 checkbox or form태그가 아닌(예. button)으로 radio(toggle and set)의 역할이 필요한 경우 사용
// '' : defaultValue
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    // form 태그가 아닌경우
    // ㄴ direct element가 아닐경우는 onChange({value}) 또는 setValue로 사용, 권장
    // ㄴ direct element일 경우 data-value로 전달하여 사용, string경우 사용
    let dataValue = e.target?.dataset?.value;
    dataValue = dataValue || e.value;
    console.log(dataValue);

    setValue(draft => {
      if (draft === dataValue) {
        return '';
        // return new Set();
      } else {
        return dataValue;
        // return new Set().add(dataValue);
      }
    });
  }, []);
  // console.log('value', value);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
