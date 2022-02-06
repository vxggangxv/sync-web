import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import InvoiceViewer from 'components/invoice/InvoiceViewer';
import InvoiceList from 'components/invoice/InvoiceList';
import useInput from 'lib/hooks/useInput';
import useDateInput from 'lib/hooks/useDateInput';
import PlainModal from 'components/common/modal/PlainModal';
import AppModal from 'components/common/modal/AppModal';
import CreateInvoiceModalContainer from 'containers/invoice/CreateInvoiceModalContainer';
import { AppActions, InvoiceActions, PartnerActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import { fetchSyncPartners } from 'api/partner';
import { string } from 'prop-types';
import { debounce } from 'lodash';
import { OffsetPagingData } from 'lib/sharedTypes';
import { useDidUpdateEffect } from 'lib/utils';

export interface InvoicePartner {
  email: string;
  groupCode: string;
  isSelf: number;
  name: string;
  partnerType: null | number;
  userGroupIdx: number;
}

export default function InvoiceContainer() {
  const {
    invoicesData: { list: invoices, pagingData: invoicesPagingData },
    fetchInvoicesSuccess,
  } = useShallowAppSelector(state => ({
    invoicesData: state.invoice.invoices.data || {},
    fetchInvoicesSuccess: state.invoice.invoices.success,
  }));

  // state
  const page = useInput(1);
  const period = useDateInput(null);
  const partner = useInput('');
  const partnerKeyword = useInput('');
  const [fetchInvoicePartnersLoading, setFetchInvoicePartnersLoading] = useState(false);
  const [invoicePartners, setInvoicePartners] = useState<any[] | InvoicePartner[]>([]);
  const [invoicePartnersPagingData, setInvoicePartnersPagingData] =
    useState<null | OffsetPagingData>(null);
  const hasMoreInvoicePartners = invoicePartnersPagingData
    ? invoicePartnersPagingData.page < invoicePartnersPagingData.totalPage
    : false;
  const keyword = useInput('');
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] = useState(false);

  // SECTION: function
  const handleCloseCreateInvoiceModal = () => setCreateInvoiceModalOpen(false);
  const handleOpenCreateInvoiceModal = () => setCreateInvoiceModalOpen(true);

  let searchParams = useMemo(
    () => ({
      page: page.value,
      partnershipIdx: partner.value,
      // period: period.value,
      startDate: period.value ? period.value[0].unix() : null,
      endDate: period.value ? period.value[1].unix() : null,
      keyword: keyword.value || '',
    }),
    [page.value, partner.value, period.value, keyword.value],
  );

  // SECTION: function
  const fetchInvoicePartners = async (value: {
    keyword?: string;
    page?: number;
    setLoading?: (value: boolean) => {};
  }) => {
    const { setLoading = () => {} } = value;
    setLoading(true);
    try {
      const { data } = await fetchSyncPartners(value);
      setLoading(false);
      return data;
    } catch (error) {
      // console.log('error', error);
      AppActions.show_toast({ type: 'error', message: (error as { message: string })?.message });
      setLoading(false);
      return;
    }
  };

  const handleFetchInvoicePartners = debounce(async (first?: boolean) => {
    if (first) {
      const result = await fetchInvoicePartners({ keyword: '', page: 1 });
      setInvoicePartners(result?.list);
      setInvoicePartnersPagingData(result?.pagingData);
      return;
    }

    if (!hasMoreInvoicePartners) return;
    const result = await fetchInvoicePartners({
      keyword: partnerKeyword.value?.trim() || '',
      page: invoicePartnersPagingData ? invoicePartnersPagingData?.page + 1 : 1,
    });
    setInvoicePartners(draft => draft.concat(result?.list));
    setInvoicePartnersPagingData(result?.pagingData);
    return;
  }, 500);

  const handleSearchInvoicePartners = debounce(async (value: string) => {
    // console.log('search value', value);
    partnerKeyword.setValue(value);
    setInvoicePartners([]);
    const result = await fetchInvoicePartners({ keyword: value?.trim() || '', page: 1 });
    setInvoicePartners(result?.list);
    setInvoicePartnersPagingData(result?.pagingData);
  }, 500);

  // TEST:
  useEffect(() => {
    console.log('invoicePartners', invoicePartners);
  }, [invoicePartners]);

  const handleSearch = () => {
    page.setValue(1);
    InvoiceActions.fetch_invoices_request({ ...searchParams, page: 1 });
  };

  const handleChangePage = (value: number) => {
    page.setValue(value);

    console.log('get project list page is', value);
    InvoiceActions.fetch_invoices_request({ ...searchParams, page: value });
  };

  const handleTogglePdfView = (id: number) => {
    // TODO: request api with id
  };

  // SECTION: DidMount

  useEffect(() => {
    handleFetchInvoicePartners(true);
    InvoiceActions.fetch_invoices_request(searchParams);

    // AppActions.add_popup({
    //   isOpen: true,
    //   // onClick:handleCloseCreateInvoiceModal,
    //   width: 1280,
    //   title: 'New Invoice',
    //   content: <CreateInvoiceModalContainer fetchInvoicePartners={fetchInvoicePartners} />,
    //   contentCardStyle: {
    //     borderRadius: '8px',
    //     marginBottom: '28px',
    //     padding: '38px 30px',
    //   },
    //   isCloseIcon: true,
    //   onCancel: handleCloseCreateInvoiceModal,
    //   hideButton: true,
    // });
  }, []);

  // SECTION: DidUpdate
  useDidUpdateEffect(() => {
    console.log('partner.value', partner.value);
    handleSearch();
  }, [partner.value, period.value, keyword.value]);

  return (
    <>
      {/* CompleteProject */}
      <PlainModal
        isOpen={createInvoiceModalOpen}
        onClose={handleCloseCreateInvoiceModal}
        width={1280}
      >
        <AppModal
          title={'New Invoice'}
          content={<CreateInvoiceModalContainer fetchInvoicePartners={fetchInvoicePartners} />}
          contentCardStyle={{
            borderRadius: '8px',
            marginBottom: '28px',
            padding: '38px 30px',
          }}
          isCloseIcon={true}
          onCancel={handleCloseCreateInvoiceModal}
          hideButton={true}
        />
      </PlainModal>
      <StyledInvoiceContainer>
        <div className="invoice__list_container">
          <InvoiceList
            // data
            invoices={invoices}
            invoicesPagingData={invoicesPagingData}
            invoicePartners={invoicePartners}
            hasMoreInvoicePartners={hasMoreInvoicePartners}
            onFetchInvoicePartners={handleFetchInvoicePartners}
            fetchInvoicePartnersLoading={fetchInvoicePartnersLoading}
            onSearchInvoicePartners={handleSearchInvoicePartners}
            // state
            page={page}
            period={period}
            partner={partner}
            keyword={keyword}
            onSearch={handleSearch}
            onChangePage={handleChangePage}
            onTogglePdfView={handleTogglePdfView}
            onOpenCreateInvoiceModal={handleOpenCreateInvoiceModal}
          />
        </div>
        <div className="invoice__pdf_container">
          {/* TODO: pass response data */}
          <InvoiceViewer />
        </div>
      </StyledInvoiceContainer>
    </>
  );
}

const StyledInvoiceContainer = styled.section`
  display: flex;
  position: relative;
  margin-bottom: 100px;
  background-color: #eff1f8;
  border-radius: 15px;
  box-shadow: inset -3px -3px 6px rgba(0, 0, 0, 0.16);

  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.16);
    border-radius: 15px;
  }

  .invoice__list_container,
  .invoice__pdf_container {
    position: relative;
    width: 50%;
  }
  .invoice__list_container {
  }
  .invoice__pdf_container {
  }
`;
