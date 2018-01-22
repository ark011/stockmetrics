import requests
import json
import math

#API Keys
api_username = 'eb87cd0b0cb5a9fcbf0cfcc181731640'
api_password = '368a1ba4a933eee17d024de2036e0592'

print("Starting script....")

stock_data = {}
financial_data = {}
project_url = "https://data.alike21.hasura-app.io/"
headers = {"Content-Type":"application/json", "Authorization":"Bearer 8f699fab753a3163cbb056cc2a3e6f9e22c05d8f125d5a1a"}

def get_sector_name(base_url, ticker):
	request_url = base_url + "/data_point?"
	query_params = {
		'identifier': ticker,
		'item':'sector'
	}
	response = requests.get(request_url, params=query_params, auth=(api_username,api_password))
	sector_name = response.json()['value']
	stock_data['sector_name'] = sector_name

def get_stock_name(base_url, ticker):
	request_url = base_url + "/data_point?"
	query_params = {
		'identifier': ticker,
		'item':'name'
	}
	response = requests.get(request_url, params=query_params, auth=(api_username,api_password))
	stock_name = response.json()['value']
	stock_data['stock_name'] = stock_name

def get_income_statement_data(base_url,ticker,year):
	request_url = base_url + "/financials/standardized"
	query_params = {
		'identifier': ticker,
		'statement':'income_statement',
		'type':'FY',
		'fiscal_year':year
	}

	response = requests.get(request_url, params=query_params, auth=(api_username,api_password))

	data = response.json()['data']

	for row in data:
		tag = row['tag']
		value = row['value']
		income_statement[tag] = value

	print("----- Successfully downloaded income statement data for " + ticker + " for year: " + str(year) + " -----")
	return income_statement

def get_balance_sheet_data(base_url,ticker, year):
	request_url = base_url + "/financials/standardized"
	query_params = {
		'identifier': ticker,
		'statement':'balance_sheet',
		'type':'FY',
		'fiscal_year':year
	}

	response = requests.get(request_url, params=query_params, auth=(api_username,api_password))

	data = response.json()['data']

	for row in data:
		tag = row['tag']
		value = row['value']
		balance_sheet[tag] = value

	print("----- Successfully downloaded balance sheet data for " + ticker + " for year: " + str(year) + " -----")
	return balance_sheet

def get_cash_flow_data(base_url,ticker, year):
	request_url = base_url + "/financials/standardized"
	query_params = {
		'identifier': ticker,
		'statement':'cash_flow_statement',
		'type':'FY',
		'fiscal_year':year
	}

	response = requests.get(request_url, params=query_params, auth=(api_username,api_password))

	data = response.json()['data']

	for row in data:
		tag = row['tag']
		value = row['value']
		cash_flow[tag] = value

	print("----- Successfully downloaded cash flow data for " + ticker + " for year: " + str(year) + " -----")
	return cash_flow

def get_calculations_data(base_url,ticker, year):
	request_url = base_url + "/financials/standardized"
	
	page_number = [1,2]

	json = []

	for page in page_number:
		query_params = {
			'identifier': ticker,
			'statement':'calculations',
			'type':'FY',
			'fiscal_year':year,
			'page_number':page
		}

		response = requests.get(request_url, params=query_params, auth=(api_username,api_password))

		data = response.json()['data']
		json.extend(data)

	for row in json:
		tag = row['tag']
		value = row['value']
		calculations[tag] = value

	print("----- Successfully downloaded calculations data for " + ticker + " for year: " + str(year) + " -----")
	return calculations

def get_return_on_equity(ticker,year,calculations):
	try:
		return_on_equity = calculations['roe']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['return_on_equity'] = float(return_on_equity)
	except:
		print ("Return on Equity data is not provided for: " + ticker)

def get_profit_margin(ticker,year,calculations):
	try:
		profit_margin = calculations['profitmargin']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['profit_margin'] = float(profit_margin)
	except:
		print ("Profit Margin data is not provided for: " + ticker)

def get_earnings_yield(ticker,year,calculations):
	try:
		earnings_yield = calculations['earningsyield']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['earnings_yield'] = float(earnings_yield)
	except:
		print ("Earnings Yield data is not provided for: " + ticker)

def get_pe_ratio(ticker,year,calculations):
	try:
		pe_ratio = calculations['pricetoearnings']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['pe_ratio'] = float(pe_ratio)
	except:
		print ("Price to Earnings data is not provided for: " + ticker)

def get_marketcap(ticker,year,calculations):
	try:
		marketcap = calculations['marketcap']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['marketcap'] = float(marketcap)
	except:
		print ("Market Cap data is not provided for: " + ticker)

def get_current_ratio(ticker,year,calculations):
	try:
		current_ratio = calculations['currentratio']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['current_ratio'] = float(current_ratio)
	except:
		print ("Current Ratio data is not provided for: " + ticker)

def get_quick_ratio(ticker,year,calculations):
	try:
		quick_ratio = calculations['quickratio']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['quick_ratio'] = float(quick_ratio)
	except:
		print ("Quick Ratio data is not provided for: " + ticker)

def get_debt_to_equity(ticker,year,calculations):
	try:
		debt_to_equity = calculations['debttoequity']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['debt_to_equity'] = float(debt_to_equity)
	except:
		print ("Debt To Equity data is not provided for: " + ticker)

def get_return_on_common_equity(ticker,year,calculations):
	try:
		return_on_common_equity = calculations['roce']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['return_on_common_equity'] = float(return_on_common_equity)
	except:
		print ("Return On Common Equity data is not provided for: " + ticker)

def get_debt_to_total_capital(ticker,year,calculations):
	try:
		debt_to_total_capital = calculations['debttototalcapital']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['debt_to_total_capital'] = float(debt_to_total_capital)
	except:
		print ("Debt To Equity data is not provided for: " + ticker)

def get_return_on_assets(ticker,year,calculations):
	try:
		return_on_assets = calculations['roa']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['return_on_assets'] = float(return_on_assets)
	except:
		print ("Return On Assets data is not provided for: " + ticker)

def get_asset_turnover(ticker,year,calculations):
	try:
		asset_turnover = calculations['assetturnover']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['asset_turnover'] = float(asset_turnover)
	except:
		print ("Asset Turnover data is not provided for: " + ticker)

def get_accounts_receivable_turnover(ticker,year,calculations):
	try:
		accounts_receivable_turnover = calculations['arturnover']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['accounts_receivable_turnover'] = float(accounts_receivable_turnover)
	except:
		print ("Accounts Receivable Turnover data is not provided for: " + ticker)

def get_inventory_turnover(ticker,year,calculations):
	try:
		inventory_turnover = calculations['invturnover']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['inventory_turnover'] = float(inventory_turnover)
	except:
		print ("Inventory Turnover data is not provided for: " + ticker)

def get_accounts_payable_turnover(ticker,year,calculations):
	try:
		accounts_payable_turnover = calculations['apturnover']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['accounts_payable_turnover'] = float(accounts_payable_turnover)
	except:
		print ("Accounts Payable Turnover data is not provided for: " + ticker)

def get_total_revenue(ticker,year,income_statement):
	try:
		total_revenue = income_statement['totalrevenue']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['total_revenue'] = float(total_revenue)
	except:
		print ("Total Revenue data is not provided for: " + ticker)

def get_total_gross_profit(ticker,year,income_statement):
	try:
		total_gross_profit = income_statement['totalgrossprofit']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['total_gross_profit'] = float(total_gross_profit)
	except:
		print ("Total Gross Profit data is not provided for: " + ticker)

def get_earnings_per_share(ticker,year,income_statement):
	try:
		earnings_per_share = income_statement['basiceps']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['earnings_per_share'] = float(earnings_per_share)
	except:
		print ("Earnings Per Share data is not provided for: " + ticker)

def get_income_tax_expense(ticker,year,income_statement):
	try:
		income_tax_expense = income_statement['incometaxexpense']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['income_tax_expense'] = float(income_tax_expense)
	except:
		print ("Income Tax Expense data is not provided for: " + ticker)

def get_total_assets(ticker,year,balance_sheet):
	try:
		total_assets = balance_sheet['totalassets']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['total_assets'] = float(total_assets)
	except:
		print ("Total Assets data is not provided for: " + ticker)

def get_total_liabilities(ticker,year,balance_sheet):
	try:
		total_liabilities = balance_sheet['totalliabilities']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['total_liabilities'] = float(total_liabilities)
	except:
		print ("Total Liabilities data is not provided for: " + ticker)

def get_cash_and_equivalents(ticker,year,balance_sheet):
	try:
		cash_and_equivalents = balance_sheet['cashandequivalents']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['cash_and_equivalents'] = float(cash_and_equivalents)
	except:
		print ("Cash & Equivalents data is not provided for: " + ticker)

def get_accounts_receivable(ticker,year,balance_sheet):
	try:
		accounts_receivable = balance_sheet['accountsreceivable']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['accounts_receivable'] = float(accounts_receivable)
	except:
		print ("Accounts & Receivable data is not provided for: " + ticker)

def get_total_current_assets(ticker,year,balance_sheet):
	try:
		total_current_assets = balance_sheet['totalcurrentassets']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['total_current_assets'] = float(total_current_assets)
	except:
		print ("Total Current Assets data is not provided for: " + ticker)

def get_total_current_liabilities(ticker,year,balance_sheet):
	try:
		total_current_liabilities = balance_sheet['totalcurrentliabilities']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['total_current_liabilities'] = float(total_current_liabilities)
	except:
		print ("Total Current Liabilities data is not provided for: " + ticker)

def get_accounts_payable(ticker,year,balance_sheet):
	try:
		accounts_payable = balance_sheet['accountspayable']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['accounts_payable'] = float(accounts_payable)
	except:
		print ("Accounts Payable data is not provided for: " + ticker)

def get_retained_earnings(ticker,year,balance_sheet):
	try:
		retained_earnings = balance_sheet['retainedearnings']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['retained_earnings'] = float(retained_earnings)
	except:
		print ("Retained Earnings data is not provided for: " + ticker)

def get_net_income(ticker,year,cash_flow):
	try:
		net_income = cash_flow['netincome']
		if year not in financial_data:
			financial_data[year] = {"year" : year}
		financial_data[year]['net_income'] = float(net_income)
	except:
		print ("Net Income data is not provided for: " + ticker)

def insert_data():
	data_url = project_url + "v1/query"

	stock_query = {
		"type":"insert",
        "args":{
        	"table":"stocks",
        	"objects":[stock_data],
        	"returning":["id"]
        	}
        }

        try:
    		resp = requests.post(data_url, headers = headers, data = json.dumps(stock_query))
    		print("Response: " + str(resp.content))
    		id = json.loads(resp.text)['returning'][0]['id']
    	except Exception as e:
    		print("Error: " + str(e))

	for obj in financial_data:
		try:
			current_data = financial_data[obj]
			current_data['stock_id'] = id
			financials_query = {
				"type":"insert",
				"args" : {
					"table" : "stock_financial_data",
					"objects":[current_data]
				}
			}
			try:
				resp = requests.post(data_url, headers=headers, data=json.dumps(financials_query))
				print("Response: " + str(resp.content))
			except Exception as e:
				print("Error %s" % str(e))
		except Exception as e:
			print("Error: " + str(e))

	print("Successfully inserted data")

def fetch_data():

	global stock_data
	global financial_data

	global income_statement
	global balance_sheet
	global cash_flow
	global calculations

	stock_data = {}
	financial_data = {}

	income_statement = {}
	balance_sheet = {}
	cash_flow = {}
	calculations = {}

	base_url = "https://api.intrinio.com"
	years = [2016, 2015, 2014]

	sp500 = ['AMG', 'AFL', 'A', 'APD', 'AKAM', 'ALK', 'ALB', 'ALXN', 'ALLE']

	for ticker in sp500:

		#API calls to get the Stock Name and Sector Name
		get_sector_name(base_url, ticker)
		get_stock_name(base_url, ticker)
		for year in years:

			#API calls to get Income Statement, Balance Sheet Statement, Cash Flow Statement, Calculations & Metrics
			get_income_statement_data(base_url,ticker,year)
			get_balance_sheet_data(base_url,ticker,year)
			get_cash_flow_data(base_url,ticker,year)
			get_calculations_data(base_url,ticker,year)
			
			#Function calls to get data from Calculations & Metrics
			get_return_on_equity(ticker,year,calculations)
			get_profit_margin(ticker,year,calculations)
			get_earnings_yield(ticker,year,calculations)
			get_pe_ratio(ticker,year,calculations)
			get_marketcap(ticker,year,calculations)
			get_current_ratio(ticker,year,calculations)
			get_quick_ratio(ticker,year,calculations)
			get_debt_to_equity(ticker,year,calculations)
			get_return_on_common_equity(ticker,year,calculations)
			get_debt_to_total_capital(ticker,year,calculations)
			get_return_on_assets(ticker,year,calculations)
			get_asset_turnover(ticker,year,calculations)
			get_accounts_receivable_turnover(ticker,year,calculations)
			get_inventory_turnover(ticker,year,calculations)
			get_accounts_payable_turnover(ticker,year,calculations)

			#Function calls to get data from Income Statement
			get_total_revenue(ticker,year,income_statement)
			get_total_gross_profit(ticker,year,income_statement)
			get_earnings_per_share(ticker,year,income_statement)
			get_income_tax_expense(ticker,year,income_statement)

			#Function calls to get data from Balance Sheet
			get_total_assets(ticker,year,balance_sheet)
			get_total_liabilities(ticker,year,balance_sheet)
			get_cash_and_equivalents(ticker,year,balance_sheet)
			get_accounts_receivable(ticker,year,balance_sheet)
			get_total_current_assets(ticker,year,balance_sheet)
			get_total_current_liabilities(ticker,year,balance_sheet)
			get_accounts_payable(ticker,year,balance_sheet)
			get_retained_earnings(ticker,year,balance_sheet)

			#Function calls to get data from Cash Flow Statement
			get_net_income(ticker,year,cash_flow)

		insert_data()


fetch_data()
