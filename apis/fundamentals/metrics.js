const PE = (price, eps) => {
    if (!price) return '';
    if (!eps) return '';
    const result = parseFloat(price)/parseFloat(eps);
    return parseFloat(result.toFixed(8));
}

const PB = (price, bvps) => {
    if (!price) return '';
    if (!bvps) return '';
    const result = parseFloat(price)/parseFloat(bvps);
    return parseFloat(result.toFixed(8));
}

const DIVYIELD = (dps, price) => {
    if (!dps) return '';
    if (!price) return '';
    const result = parseFloat(dps)/parseFloat(price);
    return parseFloat(result.toFixed(8));
}

const PAYOUTRATIO = (dps, eps) => {
    if (!dps) return '';
    if (!eps) return '';
    const result = parseFloat(dps)/parseFloat(eps);
    return parseFloat(result.toFixed(8));
}

const ROE = (netIncome, equity) => {
    if (!netIncome) return '';
    if (!equity) return '';
    const result = parseFloat(netIncome)/parseFloat(equity);
    return parseFloat(result.toFixed(8));
}

const ROA = (netIncome, assets) => {
    if (!netIncome) return '';
    if (!assets) return '';
    const result = parseFloat(netIncome)/parseFloat(assets);
    return parseFloat(result.toFixed(8));
}

const ROCE = (netIncome, liabilitiesNC) => {
    if (!netIncome) return '';
    if (!liabilitiesNC) return '';
    const result = parseFloat(netIncome)/parseFloat(liabilitiesNC);
    return parseFloat(result.toFixed(8));
}

const ROIC = (netIncome, investedCapital) => {
    if (!netIncome) return '';
    if (!investedCapital) return '';
    const result = parseFloat(netIncome)/parseFloat(investedCapital);
    return parseFloat(result.toFixed(8));
}

const assetTurnover = (revenue, assets) => {
    if (!revenue) return '';
    if (!assets) return '';
    const result = parseFloat(revenue)/parseFloat(assets);
    return parseFloat(result.toFixed(8));
}

const NETMARGIN = (netIncome, revenue) => {
    if (!netIncome) return '';
    if (!revenue) return '';
    const result = parseFloat(netIncome)/parseFloat(revenue);
    return parseFloat(result.toFixed(8));
}

const populate = (data) => {
    data.PE = PE(data.PRICE, data.EPS);
    data.PB = PB(data.PRICE, data.BVPS);
    data.DIVYIELD = DIVYIELD(data.DPS, data.PRICE);
    data.PAYOUTRATIO = PAYOUTRATIO(data.DPS, data.EPS);
    data.ROE = ROE(data.NETINC, data.EQUITY);
    data.ROA = ROA(data.NETINC, data.ASSETS);
    data.ROCE = ROCE(data.NETINC, data.LIABILITIESNC);
    data.ROIC = ROCE(data.NETINC, data.INVCAP);
    data.assetTurnover = ROCE(data.REVENUE, data.ASSETS);
    data.NETMARGIN = ROCE(data.NETINC, data.REVENUE);
}

module.exports = {
    populate
};
