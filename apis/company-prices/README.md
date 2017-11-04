#Stocks Model


##Api's


##Source


https://www.quandl.com/data/WIKI-Wiki-EOD-Stock-Prices/documentation/database-overview


All open prices for Facebook

https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?ticker=FB&qopts.columns=date,open&api_key=<api_key>
Prices for all tickers for 2016-09-12

https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date=20160912&api_key=<api_key>
Prices for Microsoft and Facebook for year 2015

https://www.quandl.com/api/v3/datatables/WIKI/PRICES.json?date.gte=20150101&date.lt=20160101&ticker=MSFT,FB&api_key=<api_key>
Ticker and date parameters are optional and let you filter the WIKI table. The qopts.columns parameter is also optional and can be used to specify columns to retrieve. For a list of universal table parameters, click here.

NOTE: Beyond the universal parameters, only columns designated as filterable can be used as criteria to filter rows. For the WIKI table, the filterable columns are: "ticker" and "date".

You can also provide a range of dates by using modified date query parameters: date.gt=<your_date> - greater than <your date> date.gte=<your_date> - greater than or equal to <your date> date.lt=<your_date> - less than <your date> date.lte=<your_date> - less than or equal to <your date>

You can pass multiple values for ticker= and date= with commas separating the values (e.g., ticker=AAPL,MSFT,FB).
