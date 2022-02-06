import React, { Fragment, useLayoutEffect, useRef } from 'react';
import ReactPDF, {
  Font,
  Image,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  pdf,
} from '@react-pdf/renderer';
import styled from '@react-pdf/styled-components';
import { color } from 'styles/utils';
import { icon_user_circle, invoice_left_bar, invoice_title } from 'components/base/images';
import moment from 'moment';
// import NotoSansKRMedium from 'static/fonts/notosanskr/NotoSansKR-Medium.woff';

Font.register({
  family: 'Noto Sans KR',
  fonts: [
    {
      src: require('static/fonts/notosanskr/NotoSansKR-Regular.woff'),
      fontStyle: 'normal',
      fontWeight: 400,
    },
    {
      src: require('static/fonts/notosanskr/NotoSansKR-Medium.woff'),
      fontStyle: 'normal',
      fontWeight: 500,
    },
    {
      src: require('static/fonts/notosanskr/NotoSansKR-Bold.woff'),
      fontStyle: 'normal',
      fontWeight: 700,
    },
  ],
});

const PageContainer = styled.Page`
  flex-direction: row;
  width: 100%;
  padding-top: 35px;
  padding-bottom: 35px;
  background-color: white;
  border: none;
  font-family: 'Noto Sans KR';
`;
const LeftSideBar = styled.View`
  width: 40px;
  position: absolute;
  top: 0;
  left: 0;
`;
const MainContainer = styled.View`
  margin-left: 40px;
  padding: 0 30px;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  padding-bottom: 10px;
`;
const SectionHeaderDate = styled.Text`
  top: -8px;
  font-size: 14px;
  color: ${color.navy_blue};
`;

const SectionBody = styled.View`
  margin-top: 20px;
`;
const ProjectInfoContainer = styled.View`
  flex-direction: row;
`;
const ProjectInfoBox = styled.View`
  font-size: 25px;
`;
const ProjectInfoProfileBox = styled.View`
  margin-right: 20px;
  width: 100px;
  border: 1px solid ${color.gray_week};
  border-radius: 5px;
`;

const ProjectInfoBoxRow1 = styled.View`
  flex-direction: row;
  font-size: 12px;
`;
const ProjectInfoBoxRow2 = styled.View`
  flex-direction: row;
  margin-top: 10px;
  font-size: 11px;
`;
const ProjectInfoBoxColCommon = styled.View`
  width: 180px;
  margin-right: 15px;
  border-right: 2px solid ${color.gray_week};
`;
const ProjectInfoBoxRow1Col1 = styled(ProjectInfoBoxColCommon)``;
const ProjectInfoBoxRow2Col1 = styled(ProjectInfoBoxColCommon)`
  flex-direction: row;
`;

const ProjectUnitTableContainer = styled.View`
  margin-top: 30px;
`;
const ProjectUnitTable = styled.View``;
const ProjectUnitTableThead = styled.View`
  border-top: 2px solid ${color.blue};
  border-bottom: 2px solid ${color.blue};
`;
const ProjectUnitTableTbody = styled.View``;
const ProjectUnitTableTr = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom: ${({ borderBottom }) => borderBottom && `1px solid ${color.blue}`};
`;
const ProjectUnitTableCell = styled.View`
  padding: 10px 0;
  font-size: 11px;
`;
const ProjectUnitTableTh = styled(ProjectUnitTableCell)``;
const ProjectUnitTableTh1 = styled(ProjectUnitTableTh)`
  width: 10%;
  text-align: center;
`;
const ProjectUnitTableTh2 = styled(ProjectUnitTableTh)`
  width: 15%;
`;
const ProjectUnitTableTh3 = styled(ProjectUnitTableTh)`
  width: 29%;
`;
const ProjectUnitTableTh4 = styled(ProjectUnitTableTh)`
  width: 11%;
`;
const ProjectUnitTableTh5 = styled(ProjectUnitTableTh)`
  width: 15%;
  text-align: right;
`;
const ProjectUnitTableTh6 = styled(ProjectUnitTableTh)`
  width: 25%;
  padding-right: 20px;
  text-align: right;
`;

const ProjectUnitTableTd = styled(ProjectUnitTableCell)``;
const ProjectUnitTableTd1 = styled(ProjectUnitTableTd)`
  width: 10%;
  text-align: center;
`;
const ProjectUnitTableTd2 = styled(ProjectUnitTableTd)`
  width: 15%;
`;
const ProjectUnitTableTd3 = styled(ProjectUnitTableTd)`
  width: 29%;
`;
const ProjectUnitTableTd4 = styled(ProjectUnitTableTd)`
  flex-direction: row;
  justify-content: space-between;
  width: 11%;
`;
const ProjectUnitTableTd5 = styled(ProjectUnitTableTd)`
  width: 15%;
  text-align: right;
`;
const ProjectUnitTableTd6 = styled(ProjectUnitTableTd)`
  width: 25%;
  padding-right: 20px;
  text-align: right;
`;

const ProjectUnitTableProjectIdRow = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${color.blue};
  font-size: 11px;
`;

const ProjectUnitSummaryTableContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
`;
const ProjectUnitSummaryTableBox = styled.View`
  width: 35%;
`;
const ProjectUnitSummaryTableTr = styled.View`
  flex-direction: row;
  border-bottom: 2px solid ${color.blue};
`;
const ProjectUnitSummaryTableTd = styled.View`
  padding: 10px 0;
  font-size: 11px;
`;
const ProjectUnitSummaryTableTd1 = styled(ProjectUnitSummaryTableTd)`
  width: 35%;
  padding-right: 2px;
  text-align: right;
`;
const ProjectUnitSummaryTableTd2 = styled(ProjectUnitSummaryTableTd)`
  width: 65%;
  padding-right: 14px;
  text-align: right;
`;

const SectionText = styled.Text`
  /* font-family: 'Noto Sans KR'; */
  font-size: 120px;
  font-weight: 500;
`;

const InvoicePdf = ({ page = {}, totalPage = {} }) => {
  return (
    <Document>
      <PageContainer>
        <LeftSideBar fixed>
          <Image src={invoice_left_bar} style={{ width: 40 }} />
        </LeftSideBar>

        <MainContainer>
          <SectionHeader fixed>
            <Image src={invoice_title} style={{ width: 140 }} />
            <SectionHeaderDate>Invoice Date : {moment().format('MMM DD, YYYY')}</SectionHeaderDate>
          </SectionHeader>

          <SectionBody>
            <ProjectInfoContainer>
              <ProjectInfoProfileBox style={{ width: 65, height: 65 }}>
                {/* TODO: user img 있을경우?  */}
                {/* <Image src={icon_user_circle} style={{ width: 100 }} /> */}
              </ProjectInfoProfileBox>

              <ProjectInfoBox>
                <ProjectInfoBoxRow1>
                  <ProjectInfoBoxRow1Col1>
                    <Text>Invoice To</Text>
                    <Text style={{ marginTop: 5 }}>Partner Name </Text>
                  </ProjectInfoBoxRow1Col1>
                  <View>
                    <Text>Project Date</Text>
                    <Text style={{ marginTop: 5 }}>
                      {moment().format('MMM DD, YYYY')} ~ {moment().format('MMM DD, YYYY')}
                    </Text>
                  </View>
                </ProjectInfoBoxRow1>

                <ProjectInfoBoxRow2>
                  <ProjectInfoBoxRow2Col1>
                    <Text style={{ marginRight: 10 }}>Order Code</Text>
                    <Text>#20211013-000000</Text>
                  </ProjectInfoBoxRow2Col1>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ marginRight: 10 }}>Account Email</Text>
                    <Text>shk@mail.com</Text>
                  </View>
                </ProjectInfoBoxRow2>
              </ProjectInfoBox>
            </ProjectInfoContainer>

            <ProjectUnitTableContainer>
              <ProjectUnitTable>
                <ProjectUnitTableThead>
                  <ProjectUnitTableTr>
                    <ProjectUnitTableTh1>
                      <Text>No</Text>
                    </ProjectUnitTableTh1>
                    <ProjectUnitTableTh2>
                      <Text>Project ID</Text>
                    </ProjectUnitTableTh2>
                    <ProjectUnitTableTh3>
                      <Text>Content</Text>
                    </ProjectUnitTableTh3>
                    <ProjectUnitTableTh4>
                      <Text>Quantity</Text>
                    </ProjectUnitTableTh4>
                    <ProjectUnitTableTh5>
                      <Text>Unit price</Text>
                    </ProjectUnitTableTh5>
                    <ProjectUnitTableTh6>
                      <Text>Price</Text>
                    </ProjectUnitTableTh6>
                  </ProjectUnitTableTr>
                </ProjectUnitTableThead>

                <ProjectUnitTableTbody>
                  {Array.from({ length: 5 }).map((item, idx) => (
                    <Fragment key={idx}>
                      {idx === 0 ? (
                        <ProjectUnitTableProjectIdRow>
                          <Text style={{ width: '10%', textAlign: 'center' }}>{idx + 1}</Text>
                          <Text>20211013-toxnsldxn-Denta-0000</Text>
                        </ProjectUnitTableProjectIdRow>
                      ) : (
                        <ProjectUnitTableTr key={idx} borderBottom>
                          <ProjectUnitTableTd1>
                            {/* <Text>{idx === 0 && idx + 1}</Text> */}
                          </ProjectUnitTableTd1>
                          <ProjectUnitTableTd2>
                            {/* <Text>{idx === 0 && '#000000'}</Text> */}
                            {/* <Text>{idx === 0 && '20211013-toxnsldxn-Denta-0000'}</Text> */}
                          </ProjectUnitTableTd2>
                          <ProjectUnitTableTd3>
                            <Text>Zirconia crown</Text>
                          </ProjectUnitTableTd3>
                          <ProjectUnitTableTd4>
                            <Text>2</Text>
                            <Text>X</Text>
                          </ProjectUnitTableTd4>
                          <ProjectUnitTableTd5>
                            <Text>20,000</Text>
                          </ProjectUnitTableTd5>
                          <ProjectUnitTableTd6>
                            <Text>40,000</Text>
                          </ProjectUnitTableTd6>
                        </ProjectUnitTableTr>
                      )}
                    </Fragment>
                  ))}
                </ProjectUnitTableTbody>
              </ProjectUnitTable>

              <ProjectUnitSummaryTableContainer>
                <ProjectUnitSummaryTableBox>
                  <ProjectUnitSummaryTableTr>
                    <ProjectUnitSummaryTableTd1>
                      <Text></Text>
                    </ProjectUnitSummaryTableTd1>
                    <ProjectUnitSummaryTableTd2>
                      <Text>165,000</Text>
                    </ProjectUnitSummaryTableTd2>
                  </ProjectUnitSummaryTableTr>

                  <ProjectUnitSummaryTableTr>
                    <ProjectUnitSummaryTableTd1>
                      <Text>Discount</Text>
                    </ProjectUnitSummaryTableTd1>
                    <ProjectUnitSummaryTableTd2>
                      <Text>50,000</Text>
                    </ProjectUnitSummaryTableTd2>
                  </ProjectUnitSummaryTableTr>

                  <ProjectUnitSummaryTableTr>
                    <ProjectUnitSummaryTableTd1>
                      <Text>A/R</Text>
                    </ProjectUnitSummaryTableTd1>
                    <ProjectUnitSummaryTableTd2>
                      <Text>200,000</Text>
                    </ProjectUnitSummaryTableTd2>
                  </ProjectUnitSummaryTableTr>

                  <ProjectUnitSummaryTableTr
                    style={{
                      marginTop: -2,
                      backgroundColor: color.navy_blue,
                      borderBottom: 'none',
                    }}
                  >
                    <ProjectUnitSummaryTableTd1>
                      <Text style={{ color: 'white' }}>Total</Text>
                    </ProjectUnitSummaryTableTd1>
                    <ProjectUnitSummaryTableTd2>
                      <Text style={{ color: 'white' }}>315,000</Text>
                    </ProjectUnitSummaryTableTd2>
                  </ProjectUnitSummaryTableTr>
                </ProjectUnitSummaryTableBox>
              </ProjectUnitSummaryTableContainer>
            </ProjectUnitTableContainer>
          </SectionBody>

          {/* <SectionText>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus tempore eligendi officia
          exercitationem excepturi magnam vero voluptas totam nisi quod aperiam distinctio magni
          molestias cupiditate nihil pariatur, perspiciatis officiis veritatis?
        </SectionText> */}

          {/* <Text
          render={({ pageNumber, totalPages }) => {
            // console.log(totalPages);
            return `${pageNumber} / ${totalPages}`;
          }}
          fixed
        /> */}
        </MainContainer>
        {/* <MainContainer>
          <Text>Main</Text>
        </MainContainer> */}
      </PageContainer>
    </Document>
  );
};

export default React.memo(InvoicePdf);
