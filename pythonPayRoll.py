''' This is a Python conversion of the PAY9 COBOL program,
    written by Callum Trayner. '''
from decimal import Decimal

def onRun():
    inputFile = open("C:\Games\CPIT\Y3 S1\PR301\Assignment2\PAY4DATA.txt",
                     'r')
    inputFileArray = inputFile.readlines()
    inputFile.close()
    global pageCount
    pageCount = 1
    employeeCount = 1
    printPageHeading()
    while employeeCount < len(inputFileArray):
        employeeData = {'number' : inputFileArray[employeeCount][:6],
                        'name' : inputFileArray[employeeCount][6:26],
                        'hours' : Decimal(inputFileArray[employeeCount]
                                          [26:30]).quantize(TWOPLACES),
                        'wageRate' : Decimal(inputFileArray[employeeCount]
                                             [30:34]).quantize(TWOPLACES),
                        'unionFee' : Decimal(inputFileArray[employeeCount]
                                             [34:38]).quantize(TWOPLACES),
                        'mortgage' : Decimal(inputFileArray[employeeCount]
                                             [38:43]).quantize(TWOPLACES)}
        employeeData = calcEmployeeValues(employeeData)
        setTotals(employeeData, employeeCount)
        employeeCount +=1
    onFinnish()

def printPageHeading():
    global Line2, Line4, outputFile
    Line2 = Line2 + str(pageCount) +' \n\n'
    outputFile = Line2 + Line4

def setOutput(line):
    global outputFile, pageCount
    lineCount = 0
    for i in outputFile:
        if i == '\n':
            lineCount += 1
    if lineCount > 13:
        # 13, because I've added an empty line at the top of the page
        #start a new page, what should it look like? do I just add a couple
        #empty lines?
        pageCount = pageCount +1
    outputFile = outputFile + line

def calcEmployeeValues(employee):
    employee['grossEarnings'] = employee['hours'] * employee['wageRate']
    employee['grossEarnings'] = Decimal(employee['grossEarnings']
                                        ).quantize(TWOPLACES)
    employee['tax'] = employee['grossEarnings'] * Decimal(0.25)
    employee['tax'] = Decimal(employee['tax']).quantize(TWOPLACES)
    employee['super'] = employee['grossEarnings'] * Decimal(0.06)
    employee['super'] = Decimal(employee['super']).quantize(TWOPLACES)
    employee['tempDeductable'] = employee['tax'] + employee['super']
    employee['nettEarnings'] = (employee['grossEarnings'] -
                                employee['tempDeductable'])
    employee['nettEarnings'] =Decimal(employee['nettEarnings']
                                      ).quantize(TWOPLACES)
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
    employee['grossEarnings'] = formatStr(employee['grossEarnings'], 6)
    employee['tax'] = formatStr(employee['tax'], 6)
    employee['unionFee'] = formatStr(employee['unionFee'], 6)
    employee['mortgage'] = formatStr(employee['mortgage'], 6)
    employee['nettEarnings'] = formatStr(employee['nettEarnings'], 6)

    employeeLine = (employee['number'] + ' ' + employee['name'] + ' '
                    + employee['grossEarnings'] + ' ' + employee['tax'] +
                    ' ' + employee['unionFee'] + ' ' +
                    employee['mortgage'] + ' ' + employee['nettEarnings']
                    + '\n')
    setOutput(employeeLine)
    return employee

def setTotals(employee, employeeCount):
    error = False
    global totals
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
    totals['gross'] = totals['gross'] + Decimal(employee['grossEarnings'])
    totals['tax'] = totals['tax'] + Decimal(employee['tax'])
    totals['nett'] = totals['nett'] + Decimal(employee['nettEarnings'])
    totals['union'] = union
    totals['mortgage'] = mortgage
    totals['employees'] = employeeCount

def onFinnish():
    global Line15, Line17, Line19, totals, outputFile
    totals['gross'] = formatStr(totals['gross'], 8, True)
    totals['tax'] = formatStr(totals['tax'], 8, True)
    totals['nett'] = formatStr(totals['nett'], 8, True)
    totals['union'] = formatStr(totals['union'], 8, True)
    totals['mortgage'] = formatStr(totals['mortgage'], 8, True)
    totals['employees'] = formatStr(totals['employees'], 2)
    totals['exceptions'] = formatStr(totals['exceptions'], 2)

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
    print(outputFile)
    outFile = open("C:\Games\CPIT\Y3 S1\PR301\Assignment2\PAY4OUTPUT.txt",
                   "w")
    outFile.write(outputFile)
    outFile.close()

def formatStr(input, length, isComma=False):
    '''this function is mostly magic. the +1 is to include the 
    final (inclusive) character in the string,
    otherwise it'll stop at inputSize (non inclusive).
    the length - 1 is to account for the i +1'''
    spaces =''
    spaceCount = 0
    output = str(input)
    for inputSize, c in enumerate(output):
        pass
    if isComma == True:
        if inputSize >= (length-1):
            length = length +1
            output = output[:2] + ',' + output[2:inputSize+2]
            '''+2 for inclusiveness and comma.
            length = max size of the string, including comma.
            else length = string size - 1'''
        elif inputSize >= (length -2):
            '''if input = 1000, and is not 10,000 do'''
            space = ' '
            length = length +1
            output = space + output[:1] + ',' + output[1:inputSize+2]
    else:
        if inputSize > (length):
            truncDifference = (inputSize - length)
            output = output[truncDifference:inputSize+1]
        else:
            truncDifference = length - inputSize
            while spaceCount < truncDifference:
                spaces = spaces + ' '
                spaceCount +=1
            output = spaces + output[:inputSize+1]            
    return output

if __name__ == "__main__":
    TWOPLACES = Decimal(10) ** -2
    outputFile = ""
    Line2 = ("\nWC_LINE2\n          A.B. CREEDEE CO. LTD." +
             "    PPAY PERIOD 01 PAGE ")
    Line4 = ("WC_LINE4\nNUMBER NAME                 GROSS   TAX" +
             "     UNION   MORT    NETT\n\n")
    Line15 = ("\nWD_LINE15\nNUMBER OF EMPLOYEES      ")
    Line17 = "WD_LINE17\n                                 TOTAL TAX   "
    Line19 = "WD_LINE19\n                                 TOTAL NETT  "
    pageCount = 0
    totals = {'gross' : 0, 'tax' : 0, 'nett' : 0, 'union' : 0, 'mortgage' :
              0, 'employees' : 0, 'exceptions' : 0}
    pay9 = onRun()