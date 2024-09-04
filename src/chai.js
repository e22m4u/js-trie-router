import * as chaiModule from 'chai';
import chaiAsPromised from 'chai-as-promised';
const chai = {...chaiModule};

chaiAsPromised(chai, chai.util);

export const expect = chai.expect;
