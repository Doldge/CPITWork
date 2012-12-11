''' This is a Python conversion of the PAY9 COBOL program,
    written by Callum Trayner. '''
from decimal import Decimal


def initialise():
    ''' This function inialises the variables that the system
    is going to use, it then calls the onRun function.'''
    global dir, TWOPLACES, outputFile, Line2, Line4, Line15, Line17, Line19
    global pageCount, lineCount, employeeCount, totals
    print("Starting")
    dir = "."
    TWOPLACES = Decimal(10) ** -2
    outputFile = ""
    Line2 = ("WC_LINE2\n          A.B. CREEDEE CO. LTD." +
             "    PPAY PERIOD 01 PAGE ")
    Line4 = ("WC_LINE4\nNUMBER NAME                 GROSS   TAX" +
             "     UNION   MORT    NETT\n\n")
    Line15 = ("WD_LINE15\nNUMBER OF EMPLOYEES      ")
    Line17 = "WD_LINE17\n                                 TOTAL TAX   "
    Line19 = "WD_LINE19\n                                 TOTAL NETT  "
    pageCount = 0
    lineCount = 16
    employeeCount = 0
    totals = {'gross': 0, 'tax': 0, 'nett': 0, 'union': 0, 'mortgage':
              0, 'employees': 0, 'exceptions': 0}
    onRun()
    print("stopping")


def onRun():
    '''The onRun function reads the inputfile, and collects each
    individual employees data from the file, it then calls the
    calc employee data function and the set totals function.'''
    print("Initialising")
    global pageCount, employeeCount, dir
    inputFile = open(dir + '\PAY4DATA.txt', 'r')
    inputFileArray = inputFile.readlines()
    inputFile.close()
    pageCount = 0
    inputCount = 0
    while inputCount < len(inputFileArray):
        '''read the data, including the decimal place!
        n.b the inputs should contain the decimal place, or a space where
        needs to be.'''
        employeeData = {'number': inputFileArray[inputCount][:6],
                        'name': inputFileArray[inputCount][6:26],
                        'hours': Decimal(inputFileArray[inputCount]
                                          [26:31]).quantize(TWOPLACES),
                        'wageRate': Decimal(inputFileArray[inputCount]
                                             [31:36]).quantize(TWOPLACES),
                        'unionFee': Decimal(inputFileArray[inputCount]
                                             [36:41]).quantize(TWOPLACES),
                        'mortgage': Decimal(inputFileArray[inputCount]
                                             [41:47]).quantize(TWOPLACES)}
        print("just read")
        for i in employeeData:
            print(str(employeeData[i]))
        employeeData = calcEmployeeValues(employeeData)
        setTotals(employeeData, employeeCount)
        inputCount +=1
    onFinnish()


def printPageHeading():
    '''This function adds the page headings to the
    output file.'''
    global Line4
    print("print Headings")
    printFirstLine()
    setOutput(Line4)


def setOutput(line):
    '''This function takes a line input, and adds it to
    the output file.'''
    global outputFile
    print("just putting out " + str(line))
    outputFile = outputFile + line


def calcEmployeeValues(employee):
    '''This function takes an employee which contains employee data
    from the input file, and then calculates the rest of the employees
    data, such as their net and gross earnings. If there nett earnings
    are not enough to pay their mortgage or union fee, then there fees
    are set to stars (*****).'''
    global lineCount, employeeCount
    print("Dealing with Employee ")
    for i in employee:
        print(str(employee[i]))
    employeeCount +=1
    print("Calc Values")
    employee['grossEarnings'] = employee['hours'] * employee['wageRate']
    employee['grossEarnings'] = (Decimal(employee['grossEarnings'])
                                 .quantize(TWOPLACES))
    employee['tax'] = employee['grossEarnings'] * Decimal('0.25')
    employee['tax'] = Decimal(employee['tax']).quantize(TWOPLACES)
    employee['super'] = employee['grossEarnings'] * Decimal('0.06')
    employee['super'] = Decimal(employee['super']).quantize(TWOPLACES)
    employee['tempDeductable'] = employee['tax'] + employee['super']
    employee['nettEarnings'] = (employee['grossEarnings'] -
                                employee['tempDeductable'])
    employee['nettEarnings'] =(Decimal(employee['nettEarnings'])
                               .quantize(TWOPLACES))
    if employee['unionFee'] <= employee['nettEarnings']:
        employee['nettEarnings'] = (employee['nettEarnings'] -
                                    employee['unionFee'])
    else:
        employee['unionFee'] = "  *****"
    if employee['mortgage'] <= employee['nettEarnings']:
        employee['nettEarnings'] = (employee['nettEarnings'] -
                                     employee['mortgage'])
    else:
        employee['mortgage'] = "  *****"
    print("Gross: " + str(employee["grossEarnings"]))
    print("Set up Line: " + employee['name'])
    employee['grossEarnings'] = formatStr(employee['grossEarnings'], 7)
    employee['tax'] = formatStr(employee['tax'], 7)
    employee['unionFee'] = formatStr(employee['unionFee'], 7)
    employee['mortgage'] = formatStr(employee['mortgage'], 7)
    employee['nettEarnings'] = formatStr(employee['nettEarnings'], 7)
    employeeLine = (employee['number'] + ' ' + employee['name'] + ' '
                    + employee['grossEarnings'] + ' ' + employee['tax'] +
                    ' ' + employee['unionFee'] + ' ' +
                    employee['mortgage'] + ' ' + employee['nettEarnings']
                    + '\n')
    for i in employeeLine:
        if i == '\n':
            lineCount = lineCount + 1
    if lineCount > 12:
        lineCount = 0
        printPageHeading()
    setOutput(employeeLine)
    return employee


def setTotals(employee, employeeCount):
    '''This function takes an employee data set and adds it to
    the group total, it then increments employee count.'''
    error = False
    global totals
    print("Accumulating Totals")
    try:
        union = totals['union'] + Decimal(employee['unionFee'])
    except:
        union = totals['union']
        error = True
    try:
        mortgage = totals['mortgage'] + Decimal(employee['mortgage'])
    except:
        mortgage = totals['mortgage']
        error = True
    if error == True:
        totals['exceptions'] = totals['exceptions'] + 1
    #COBOL App thinks gross = sum(nett), and nett = sum(gross)
    totals['gross'] = totals['gross'] + Decimal(employee['nettEarnings'])
    totals['tax'] = totals['tax'] + Decimal(employee['tax'])
    totals['nett'] = totals['nett'] + Decimal(employee['grossEarnings'])
    totals['union'] = union
    totals['mortgage'] = mortgage
    totals['employees'] = employeeCount


def onFinnish():
    '''This function adds the final group totals to the output
    file, and then prints/saves the output file. After which, it
    closes the output file from memory.'''
    global Line15, Line17, Line19, totals, outputFile, pageCount
    print("Tidying up")
    totals['gross'] = formatStr(totals['gross'], 8, True)
    totals['tax'] = formatStr(totals['tax'], 8, True)
    totals['nett'] = formatStr(totals['nett'], 8, True)
    totals['union'] = formatStr(totals['union'], 8, True)
    totals['mortgage'] = formatStr(totals['mortgage'], 8, True)
    totals['employees'] = formatStr(totals['employees'], 3)
    totals['exceptions'] = formatStr(totals['exceptions'], 3)
    print("Print Totals")
    printFirstLine()
    Line15 = (Line15 + totals['employees'] + '     TOTAL GROSS ' +
              totals['gross'] + '   TOTAL UNION '
              + totals['union'] + '\n\n')
    setOutput(Line15)
    Line17 = (Line17 + totals['tax'] + '   TOTAL MORTGA' +
              totals['mortgage'] + '\n\n')
    setOutput(Line17)
    Line19 = (Line19 + totals['nett'] + '   EXCEPTIONS  ' +
              totals['exceptions'])
    setOutput(Line19)
    #print(outputFile)
    outFile = open(dir + "\PAY4OUTPUT.txt",
                   "w")
    outFile.write(outputFile)
    outFile.close()


def printFirstLine():
    '''this function resets the line feed to
    position 0,0 and prints the first line.'''
    global outputFile, Line2, pageCount
    print("print First line")
    outputFile = outputFile + '\f'
    pageCount = pageCount +1
    line = Line2 + str(pageCount) +' \n\n'
    setOutput(line)


def formatStr(input, length, isComma=False):
    '''this function is mostly magic. the +1 is to include the
    final (inclusive) character in the string,
    otherwise it'll stop at inputSize (non inclusive).
    the length - 1 is to account for the i +1
    all of the funny dotPos stuff is to only collect
    the first x-set numbers, and not the last x-set
    of numbers (re:Truncating correctly)'''
    spaces =''
    dotPos = length -3
    spaceCount = 0
    truncDifference = dotPos
    output = str(input)
    for inputSize, inputChar in enumerate(output):
        try:
            int(inputChar)
        except ValueError:
            if inputChar != '*':
                '''if inputchar is a '.' and not a '*'
                then set dot-position to the current position.
                the +1 is for including the dot'''
                dotPos = inputSize+1
    inputSize = inputSize +1
    if isComma == True:
        if ((inputSize) >= (length)):
            output = (output[:2] + ',' + output[2:truncDifference] +
                      output[dotPos-1:inputSize])
            '''inputsize +1 for comma.
            length = max size of the string, excluding comma.
            else length = string size - 1'''
            '''elif inputSize >= (length -1):'''
        else:
            truncDifference = length - inputSize
            '''if input = 1000, and is not 10,000 do'''
            while spaceCount < truncDifference:
                spaces = spaces + ' '
                spaceCount +=1
            if inputSize > (length - 2):
                output = spaces + output[:1] + ',' + output[1:inputSize]
            elif inputSize <= (length -2):
                output = spaces + ' ' + output
    else:
        if (dotPos) > (length-2):
            output = output[:truncDifference] + output[dotPos-1:inputSize]
        else:
            truncDifference = length - inputSize
            while spaceCount < truncDifference:
                spaces = spaces + ' '
                spaceCount +=1
            output = spaces + output[:inputSize]
    return output


def _test(): #req'd for doctest
    """
    >>> setOutput("String-Line")
    just putting out String-Line

    >>> setOutput(2)
    Traceback (most recent call last):
    ...
    TypeError: cannot concatenate 'str' and 'int' objects
    """
    import doctest
    doctest.testmod()

if __name__ == "__main__":
    dir, TWOPLACES, outputFile, Line2, Line4, Line15 = "", "", "", "", "", ""
    Line17, Line19, pageCount, lineCount, employeeCount = "", "", "", "", ""
    totals = {}
    '''un-comment the below line to try doctests.
    N.B. Doctest has been throwing weird concatenate errors.'''
    #_test()
    pay9 = initialise()
