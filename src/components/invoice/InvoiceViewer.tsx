import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import * as htmlToImage from 'html-to-image';
// import jsPDF from 'jspdf';
import { PDFDownloadLink, usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import InvoicePdf from './InvoicePdf';
import useInput from 'lib/hooks/useInput';
import { throttle } from 'lodash';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MuiButton from 'components/common/button/MuiButton';
import DownloadIcon from 'components/base/icons/DownloadIcon';

interface InvoiceViewerProps {}

function InvoiceViewer() {
  const invoiceScrollRef = useRef<HTMLDivElement | null>(null);
  const page = useInput(null);
  const totalPage = useInput(null);

  const [instance, updateInstance] = usePDF({ document: <InvoicePdf /> });
  const [numPages, setNumPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);

  // capture image and convert pdf
  // const pdf = new jsPDF();
  // const pdfSuffix = 'merchantCode';

  // const handleDownloadPdf = () => {
  //   pdf.save(`DOF(${pdfSuffix}).pdf`);
  // };

  // useLayoutEffect(() => {
  //   window.scrollTo(0, 0);
  //   if (invoicePdfRef.current) {
  //     htmlToImage.toPng(invoicePdfRef.current).then(dataUrl => {
  //       const imgProps = pdf.getImageProperties(dataUrl);
  //       const pdfWidth = pdf.internal.pageSize.getWidth();
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //       pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     });
  //   }
  // }, [invoicePdfRef.current]);

  // SECTION: function
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePrevPage = () => {
    if (invoiceScrollRef.current) {
      let targetPdfHeight =
        invoiceScrollRef.current?.querySelector('.react-pdf__Document')?.clientHeight || 0;
      targetPdfHeight = targetPdfHeight + 2;
      const pageScrollTop = targetPdfHeight * (pageNumber - 2);
      invoiceScrollRef.current.scrollTop = pageScrollTop;
    }

    setPageNumber(pageNumber - 1);
  };

  const handleNextPage = () => {
    if (invoiceScrollRef.current) {
      let targetPdfHeight =
        invoiceScrollRef.current?.querySelector('.react-pdf__Document')?.clientHeight || 0;
      targetPdfHeight = targetPdfHeight + 2;
      const pageScrollTop = targetPdfHeight * pageNumber;
      invoiceScrollRef.current.scrollTop = pageScrollTop;
    }

    setPageNumber(pageNumber + 1);
  };

  const handlePdfScroll = throttle((e: any) => {
    // console.log('e', e);
    const currentScrollTop = invoiceScrollRef.current?.scrollTop || 0;
    let targetPdfHeight =
      invoiceScrollRef.current?.querySelector('.react-pdf__Document')?.clientHeight || 0;
    targetPdfHeight = targetPdfHeight + 2;

    const currentPageNumber = Math.floor(currentScrollTop / targetPdfHeight) + 1;
    // console.log(currentScrollTop / targetPdfHeight);
    // console.log(currentPageNumber);
    setPageNumber(currentPageNumber);
  }, 300);

  // DidMount
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  // DidUpdate
  // useDidUpdateEffect(() => {
  //   const invoiceScrollY = invoiceScrollRef?.current?.scrollTop;
  //   console.log('invoiceScrollY', invoiceScrollY);
  // }, [invoiceScrollRef?.current]);

  const list = ['&amp;'];

  return (
    <StyledInvoiceViewer data-component-name="InvoiceViewer">
      <div className="invoiceViewer__wrapper">
        <div className="invoiceViewer__container" ref={invoiceScrollRef} onScroll={handlePdfScroll}>
          <div className="invoiceViewer__box">
            {/* <PDFViewer width={600} height={850} style={{ flex: 1 }} showToolbar={false}>
            <InvoicePdf />
          </PDFViewer> */}

            {instance.url &&
              Array.from({ length: numPages }).map((item, idx) => (
                <Document
                  key={idx}
                  // file={require('./sample.pdf')}
                  file={instance.url}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={error => console.log(error.message)}
                >
                  <Page pageNumber={idx + 1} />
                </Document>
              ))}
          </div>
        </div>

        <div className="invoiceViewer__page_container">
          <div className="invoiceViewer__page_box">
            <button onClick={handlePrevPage} disabled={pageNumber <= 1} className="btn-reset">
              <ArrowBackIosIcon fontSize="inherit" />
            </button>
            <p>
              {pageNumber} of {numPages}
            </p>
            <button
              onClick={handleNextPage}
              disabled={pageNumber >= numPages}
              className="btn-reset"
            >
              <ArrowForwardIosIcon fontSize="inherit" />
            </button>
          </div>
        </div>

        <div className="invoiceViewer__btn_box">
          {/* <button onClick={handleDownloadPdf}>Download to Pdf</button> */}
          {/* <PDFDownloadLink document={<InvoicePdf />} fileName="somename.pdf">
            {({ blob, url, loading, error }) =>
              loading ? 'Loading document...' : 'Download now!'
            }
          </PDFDownloadLink> */}

          <MuiButton
            config={{ width: 280 }}
            variant="contained"
            color="secondary"
            className="md border-radius-round inset-shadow-default"
          >
            <PDFDownloadLink
              fileName="pdf_name"
              document={<InvoicePdf />}
              className="invoiceViewer__download_link"
            >
              <DownloadIcon color="white" width={18} /> Download
            </PDFDownloadLink>
          </MuiButton>
        </div>
      </div>

      {/* <h1>Invoice</h1>

      <div className="invoiceViewer__container" ref={invoicePdfRef}>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis corporis aspernatur
          quisquam cupiditate illo sequi, nemo similique quas iusto magni eaque dignissimos odio
          suscipit reiciendis aliquam nisi amet! Nostrum, velit.
        </p>
      </div>

      <div className="invoiceViewer__btn_box">
        <button onClick={handleDownloadPdf}>Download to Pdf</button>
      </div> */}
    </StyledInvoiceViewer>
  );
}

const StyledInvoiceViewer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 0;

  .invoiceViewer__container {
    height: 841px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
    overflow-y: auto;

    .invoiceViewer__box {
      width: 595px;
    }
    .react-pdf__Document {
      &:not(:last-child) {
        border-bottom: 2px solid lightgray;
      }
    }
  }

  .invoiceViewer__page_container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    font-size: 12px;
    /* border: 1px solid #ddd; */
    .invoiceViewer__page_box {
      display: flex;
      align-items: center;
      padding: 2px 5px;
      background-color: white;
      border-radius: 5px;
      line-height: 1;
      p {
        margin: 0 5px;
      }
      svg {
        font-size: 12px;
      }
      button {
        padding: 5px 3px;
      }
    }
  }

  .invoiceViewer__btn_box {
    display: flex;
    justify-content: center;
    .invoiceViewer__download_link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 40px;
      svg {
        margin-right: 10px;
      }
    }
  }
`;

export default React.memo(InvoiceViewer);

/* margin: 3px 4px 13px; */
/* margin: -3px -4px -13px; */
