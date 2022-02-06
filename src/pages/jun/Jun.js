import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LogoSyncText from 'components/base/images/LogoSyncText';
import AsyncFetchSelect from 'components/common/select/AsyncFetchSelect';
import useInput from 'lib/hooks/useInput';
import { PartnerActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import { useDidUpdateEffect } from 'lib/utils';
import { debounce } from 'lodash';

export default function Jun(props) {
  const { syncPartnersData, fetchSyncPartnersSuccess, fetchSyncPartnersPending } =
    useShallowAppSelector(state => ({
      syncPartnersData: state.partner.syncPartners.data,
      fetchSyncPartnersSuccess: state.partner.syncPartners.success,
      fetchSyncPartnersPending: state.partner.syncPartners.pending,
    }));
  const [syncPartners, setSyncPartners] = useState([]);
  const syncPartnersPagingData = syncPartnersData?.pagingData;
  const hasMoreSyncPartners = syncPartnersPagingData?.page < syncPartnersPagingData?.totalPage;
  // const [text, setText] = useInput('');
  const [value, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState('');

  // SECTION: function
  const handleFetch = first => {
    if (first) PartnerActions.fetch_sync_partners_request({ keyword: '', page: 1 });

    const { page, totalPage } = syncPartnersPagingData;
    if (page >= totalPage) return;
    PartnerActions.fetch_sync_partners_request({ keyword: value, page: page + 1 });
  };

  const handleSearch = debounce(value => {
    // 키워드 설정, fetchData 초기화
    setValue(value);
    setSyncPartners([]);
    PartnerActions.fetch_sync_partners_request({ keyword: value, page: 1 });
  }, 500);

  // TEST:
  // useEffect(() => {
  //   console.log('selectedText.value', selectedText.value);
  // }, [selectedText.value]);

  // SECTION: DidMount
  useEffect(() => {
    PartnerActions.fetch_sync_partners_request({ keyword: '', page: 1 });
  }, []);

  // SECTION: DidUpdate
  useDidUpdateEffect(() => {
    if (fetchSyncPartnersSuccess) setSyncPartners(syncPartnersData?.list);
  }, [!!fetchSyncPartnersSuccess]);

  return (
    <StyledJun>
      <AsyncFetchSelect
        className="sm"
        fontColor="white"
        borderColor="white"
        hoverBorderColor="white"
        activeBorderColor="white"
        loadingIconColor="white"
        dropIconColor="white"
        placeholderColor="white"
        inputProps={{
          // value: value,
          // setValue: setValue,
          placeholder: 'select partners...',
          placeholderColor: 'white',
          defaultValue: value,
          selectedValue: selectedValue,
          setSelectedValue: setSelectedValue,
          data: syncPartners,
          hasMoreData: hasMoreSyncPartners,
          idKey: 'userGroupIdx',
          labelKey: 'name',
          onFetch: handleFetch,
          searchLoading: fetchSyncPartnersPending,
          onSearch: handleSearch,
        }}
      />
    </StyledJun>
  );
}

const StyledJun = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  /* margin-top: 300px; */
  width: 900px;
  height: 600px;
  background-color: navy;
`;
