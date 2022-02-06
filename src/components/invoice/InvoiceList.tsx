import MuiButton from 'components/common/button/MuiButton';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AddIcon from '@material-ui/icons/Add';
import { icon_magnifier, icon_nav_invoice } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { FormControl, IconButton, MenuItem, Select, TextField } from '@material-ui/core';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import cx from 'classnames';
import { color } from 'styles/utils';
import EyeIcon from 'components/base/icons/EyeIcon';
import MuiPagination from 'components/common/pagination/MuiPagination';
import useRadioInput from 'lib/hooks/useRadioInput';
import { InvoicePartner } from 'containers/invoice/InvoiceContainer';
import AsyncFetchSelect from 'components/common/select/AsyncFetchSelect';
import { DebouncedFunc } from 'lodash';
import { OffsetPagingData } from 'lib/sharedTypes';
import { addCommas } from 'lib/library';

// currency: "KRW";
// endDate: "2021-10-31";
// enrollDate: 1641189334;
// invoiceCode: "2201036796360000";
// maxEndDate: 1632715024;
// minStartDate: 1632715024;
// partnerName: "partner name";
// startDate: "2021-10-01";
// total: 1021000;

interface Invoice {
  currency: string;
  endDate: string;
  enrollDate: number;
  invoiceCode: string;
  maxEndDate: number;
  minStartDate: number;
  partnerName: string;
  startDate: string;
  total: number;
}

interface InvoiceListProps {
  // data
  invoices: Invoice[];
  invoicesPagingData: OffsetPagingData;
  invoicePartners: InvoicePartner[];
  hasMoreInvoicePartners: boolean;
  onFetchInvoicePartners: DebouncedFunc<(first?: boolean | undefined) => Promise<void>>;
  fetchInvoicePartnersLoading: boolean;
  onSearchInvoicePartners: DebouncedFunc<(value: string) => Promise<void>>;
  // state
  page: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  period: { value: Date | null; onChange: (e: any) => void; setValue: (value: Date) => void };
  partner: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  keyword: { value: string; onChange: (e: any) => void; setValue: (value: string) => void };
  onSearch: () => void;
  onChangePage: (value: number) => void;
  onTogglePdfView: (value: number) => void;
  onOpenCreateInvoiceModal: () => void;
}

function InvoiceList({
  // data
  invoices,
  invoicesPagingData,
  invoicePartners,
  hasMoreInvoicePartners,
  onFetchInvoicePartners,
  fetchInvoicePartnersLoading,
  onSearchInvoicePartners,
  // state
  page,
  period,
  partner,
  keyword,
  onSearch,
  onChangePage,
  onTogglePdfView,
  onOpenCreateInvoiceModal,
}: InvoiceListProps) {
  const toggledInvoiceView = useRadioInput('');

  const handleTogglePdf = (id: number) => {
    toggledInvoiceView.onChange({ value: id });
    onTogglePdfView(id);
  };

  return (
    <StyledInvoiceList data-component-name="InvoiceList">
      <div className="invoiceList__title_container">
        <div className="invoiceList__title_box">
          <img src={icon_nav_invoice} alt="dollar icon" width={60} />
          <h2>
            <CustomSpan fontSize={26} fontWeight={500}>
              Invoice List
            </CustomSpan>
          </h2>
        </div>
        <MuiButton
          config={{
            width: 175,
          }}
          className="invoiceList__new_invoice_btn md inset-shadow-default border-radius-round"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onOpenCreateInvoiceModal}
        >
          New Invoice
        </MuiButton>
      </div>

      <div className="invoiceList__content_container">
        <div className="invoiceList__filter_box">
          {/* <MuiWrapper className="sm invoiceList__partner_select_box" isGlobalStyle>
            <FormControl fullWidth variant="outlined">
              <Select
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                  marginThreshold: 10,
                }}
                displayEmpty
                // multiple
                // name="preferedProgram"
                value={partner?.value}
                onChange={partner?.onChange}
                // renderValue={selected => {
                //   if (selected.length === 0) return '';
                //   const selectedLabelList = toolList.reduce((acc, curr) => {
                //     if (selected.includes(curr.id)) return acc.concat(curr.label);
                //     return acc;
                //   }, []);

                //   return selectedLabelList.join(', ');
                // }}
              >
                <MenuItem value="" disabled>
                  <CustomSpan fontColor={color.gray_week}>Partner list</CustomSpan>
                </MenuItem>
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </Select>
            </FormControl>
          </MuiWrapper> */}
          <AsyncFetchSelect
            className="sm invoiceList__partner_select_box"
            inputProps={{
              placeholder: 'Patner list',
              selectedValue: partner.value,
              setSelectedValue: partner.setValue,
              data: invoicePartners,
              hasMoreData: hasMoreInvoicePartners,
              idKey: 'userGroupIdx',
              labelKey: 'name',
              onFetch: onFetchInvoicePartners,
              searchLoading: fetchInvoicePartnersLoading,
              onSearch: onSearchInvoicePartners,
            }}
          />

          <CustomDatePicker
            type="rangeDate"
            fullWidth
            borderColor="#B5B7C1"
            height={32}
            fontSize={12}
            value={period.value}
            onChange={period.onChange}
            className={cx({
              error: period.value !== null ? !period.value : false,
            })}
            isClient={true}
          />
          <MuiWrapper
            className="invoiceList__search_wrapper sm"
            config={{
              borderColor: 'transparent',
              activeBorderColor: 'transparent',
              hoverBorderColor: 'transparent',
            }}
          >
            <>
              <TextField
                className="radius-md"
                variant="outlined"
                fullWidth
                placeholder="Search for the Project"
                value={keyword.value || ''}
                onChange={keyword.onChange}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
              />
              <button className="btn-reset invoiceList__search_btn" onClick={onSearch}>
                <img src={icon_magnifier} alt="search" />
              </button>
            </>
          </MuiWrapper>
        </div>

        <div className="invoiceList__table_container">
          <table className="invoiceList__table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>

            <thead>
              <tr>
                <th>
                  <CustomSpan fontColor={color.gray_week}>No.</CustomSpan>
                </th>
                <th>Partner</th>
                <th>Period</th>
                <th>SalesPrice</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {!!invoices?.length &&
                invoices.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <CustomSpan fontColor={color.gray_week}>
                        {(invoicesPagingData?.page - 1) * 10 + idx + 1}
                      </CustomSpan>
                    </td>
                    <td>{item.partnerName}</td>
                    <td>20211001~20211019</td>
                    <td>&#65510; {addCommas(item.total)}</td>
                    <td>
                      <IconButton onClick={() => handleTogglePdf(idx)}>
                        <EyeIcon
                          color={toggledInvoiceView.value === idx ? color.blue : color.gray_week}
                        />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              {/* {Array.from({ length: 10 }).map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <CustomSpan fontColor={color.gray_week}>{idx + 1}</CustomSpan>
                  </td>
                  <td>DOF Bridge</td>
                  <td>20211001~20211019</td>
                  <td>&#65510; 3,012,000</td>
                  <td>
                    <IconButton onClick={() => handleTogglePdf(idx)}>
                      <EyeIcon
                        color={toggledInvoiceView.value === idx ? color.blue : color.gray_week}
                      />
                    </IconButton>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>

          <MuiPagination
            config={{
              justifyContent: 'center',
            }}
            count={invoicesPagingData?.totalPage}
            page={page.value}
            onChange={(e: any, value: number) => onChangePage(value)}
          />
        </div>
      </div>
    </StyledInvoiceList>
  );
}

const StyledInvoiceList = styled.div`
  padding: 50px 0;
  height: 100%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);

  .invoiceList__title_container {
    display: flex;
    justify-content: space-between;
    padding: 0 30px;

    .invoiceList__title_box {
      display: flex;
      align-items: center;
      img {
        margin-right: 30px;
      }
    }
  }

  .invoiceList__content_container {
    margin-top: 50px;
    padding: 0 30px;

    .invoiceList__filter_box {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .invoiceList__partner_select_box {
        width: 155px;
      }

      .datePicker__box {
        width: 225px;
        .ant-picker-input {
          width: 65px;
        }
        .ant-picker {
          /* border-color: transparent; */
          /* .ant-picker-input > input {
            font-size: 12px;
          } */
        }
      }

      .invoiceList__search_wrapper {
        position: relative;
        width: 330px;
        .MuiInputBase-root {
          background-color: #f4f5fa;
        }
        .invoiceList__search_btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          top: 0;
          width: 32px;
          height: 32px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: ${color.navy_blue};
          img {
            width: 18px;
          }
        }
      }
    }

    .invoiceList__table_container {
      margin-top: 20px;

      .muiPagination {
        margin-top: 30px;
      }

      .invoiceList__table {
        width: 100%;
        table-layout: fixed;

        col {
          &:nth-child(1) {
            width: 10%;
          }
          &:nth-child(2) {
            width: 25%;
          }
          &:nth-child(3) {
            width: 25%;
          }
          &:nth-child(4) {
            width: 25%;
          }
          &:nth-child(5) {
            width: 15%;
          }
        }

        th,
        td {
          padding: 0 10px;
          vertical-align: middle;
          text-align: center;
          &:nth-child(2) {
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          &:nth-child(3) {
            text-align: left;
          }
          &:nth-child(4) {
            text-align: right;
          }
        }
        th {
          background-color: #f4f5fa;
          font-size: 15px;
          font-weight: 500;

          &:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
        td {
          font-size: 13px;
        }

        tr {
        }

        thead {
          tr {
            height: 40px;
          }
        }
        tbody {
          tr {
            height: 60px;
          }
        }
      }
    }
  }
`;

export default React.memo(InvoiceList);
