import { useCallback, useMemo, useState } from 'react';

// 단일 checkbox에서 사용
// '' : defaultValue
export default defaultValue => {
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(e => {
    const checked = e.target?.checked;
    setValue(checked);
  }, []);

  return useMemo(() => ({ value, onChange, setValue }), [value]);
};
