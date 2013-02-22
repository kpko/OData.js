describe 'odata', ->
	odata = null

	beforeEach =>
		odata = new OData('/Contacts')

	describe 'OData object', ->
		it 'should be a constructor function', ->
			expect(typeof OData).toBe('function')
		it 'should be defined', ->
			expect(odata).toBeDefined()

	describe 'OData instance', ->
		it 'should be known as q', ->
			expect(odata).toBeDefined()

	describe 'orderby', ->
		it 'should add an entry to the orderby statements list', ->
			odata.orderby('FirstName desc')

			statements = odata.get_statements()
			expect(statements).toBeDefined()

			stmt = statements[0]
			expect(stmt.properties[0]).toBe('FirstName desc')

		it 'should set the orderby statement to a property', ->
			url = odata.orderby('FirstName').url()
			expect(url).toBe('/Contacts?$orderby=FirstName')

		it 'should take an optional parameter asc/desc for the sort direction', ->
			url = odata.orderby('FirstName desc').url()
			expect(url).toBe('/Contacts?$orderby=FirstName desc')

		it 'should allow multiple orderby statements', ->
			url = odata.orderby('FirstName desc', 'LastName', 'Age asc')
			.url()

			expect(url).toBe('/Contacts?$orderby=FirstName desc,LastName,Age asc')
		it 'should allow multiple orderby statements as array', ->
			url = odata.orderby(['FirstName desc', 'LastName', 'Age asc']).url()
			expect(url).toBe('/Contacts?$orderby=FirstName desc,LastName,Age asc')
		it 'should allow multiple orderby calls for multiple statements', ->
			url = odata.orderby('FirstName desc')
					.orderby('LastName')
					.orderby('Age asc')
					.url()
			expect(url).toBe('/Contacts?$orderby=FirstName desc,LastName,Age asc')

	describe 'skip', ->
		it 'should append skip with a number', ->
			url = odata.skip(5).url()
			expect(url).toBe('/Contacts?$skip=5')

	describe 'top', ->
		it 'should append top with a number', ->
			url = odata.top(5).url()
			expect(url).toBe('/Contacts?$top=5')

	describe 'combinations', ->
		it 'should be able to do everything at once', ->
			url = odata.skip(30)
					.top(10)
					.orderby('LastName', 'FirstName', 'Age desc')
					.url()

			expect(url).toBe('/Contacts?$skip=30$top=10$orderby=LastName,FirstName,Age desc')