import styled, { css } from 'styled-components';

// interface
export interface Tooth {
  // [key: string]: unknown;
  // index?: number | null;
  number?: number | null | any;
  hasData?: boolean;
  color?: string;
  implantType?: number;
  indicationIdx?: number;
  material?: number;
  preparationType?: number;
  reconstructionType?: number;
  separateGingivaScan?: boolean | number;
  situScan?: boolean | number;
  teethTreatmentIdx?: number;
  gapWithCement?: number;
  minimalTickness?: number;
  millingToolDiameter?: number;
  virtualGingiva?: number;
  thimbleCrown?: number;
  cervicalAdaption?: number;
}

export interface InFormatImplant {
  key: string;
  seq: number;
  name: string;
}

export interface InFormatMaterial {
  seq: number;
  name: string;
  implantList: InFormatImplant[];
}

export interface Indication {
  seq: number;
  name: string;
  materialList: InFormatMaterial[];
}

export interface IndicationSeq {
  seq: number;
  name: string;
  list: Indication[];
}

export interface Material {
  idx: number;
  code: string;
  name: string;
}
export interface Implant {
  idx: number;
  type: string;
}

// style
export const paperStyle = css`
  padding: 40px 25px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
`;

export const paperBadgeStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 25px;
  width: 58px;
  height: 58px;
  border: 5px solid #b5b7c1;
  border-radius: 30px;
  font-size: 29px;
  color: #b5b7c1;
  font-weight: 500;
`;
