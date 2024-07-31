const matrixA = {
    name: "A",
    row: 0,
    column: 0,
    rowInput: document.getElementById("A_row"),
    columnInput: document.getElementById("A_column"),
    printBtn: document.getElementById("A_printBtn"),
    randomBtn: document.getElementById("A_randomBtn"),
    resetBtn: document.getElementById("A_resetBtn"),
    matrixArea: document.getElementById("A_matrixArea"),
    data: [],
    isReady: false,
}

const matrixB = {
    name: "B",
    row: 0,
    column: 0,
    rowInput: document.getElementById("B_row"),
    columnInput: document.getElementById("B_column"),
    printBtn: document.getElementById("B_printBtn"),
    randomBtn: document.getElementById("B_randomBtn"),
    resetBtn: document.getElementById("B_resetBtn"),
    matrixArea: document.getElementById("B_matrixArea"),
    data: [],
    isReady: false,
}

const resultMatrix = {
    name: "R",
    row: 0,
    column: 0,
    rowInput: document.getElementById("Result_row"),
    columnInput: document.getElementById("Result_column"),
    plusBtn: document.getElementById("plusBtn"),
    minusBtn: document.getElementById("minusBtn"),
    multipleBtn: document.getElementById("multipleBtn"),
    matrixArea: document.getElementById("Result_matrixArea"),
    data: [],
    isReady: false,

}
const matrixFunctions = { // 함수 보관 객체
    setMatrix: (matrix) => { // 매트릭스 크기 받아와서 세팅
        matrix.row = Number(matrix.rowInput.value);
        matrix.column = Number(matrix.columnInput.value);
        matrix.matrixArea.innerHTML = "";
    },
    setData: (matrix) => { // 계산에 사용할 스크립트 용 데이터 생성
        for (let i = 0; i < matrix.row; i++) {
            matrix.data[i] = [];
            for (let j = 0; j < matrix.column; j++) {
                matrix.data[i][j] = 0;
            }
        }
    },
    printClick: (matrix) => { // 화면에 행렬 출력
        matrix.matrixArea.style.width = `${ Math.round(36 * matrix.column)}px`;
        for (let i = 0; i < matrix.row; i++) {
            for (let j = 0; j < matrix.column; j++) {
                matrix.matrixArea.innerHTML += `<input id="cell${matrix.name}${i}${j}" class="cell cellDesign" type="text" />`;
            }
        }
    },
    printProcessor: (matrix) => { // 분리된 프린트 과정을 한번에 실행
        matrixFunctions.setMatrix(matrix);
        matrixFunctions.printClick(matrix);
        matrixFunctions.setData(matrix);

        matrix.isReady = true;
        interfaceFunctions.cellException( matrix );
    },
    updateData: (matrix, event) => { // 배열에 값이 입력될 때 데이터 갱신
        const data = event.target;
        const row = data.id[data.id.length - 2];
        const column = data.id[data.id.length - 1];
        matrix.data[row][column] = Number(data.value);
    },
    randomClick: (matrix) => { // 배열에 랜덤값 입력
        for (let i = 0; i < matrix.row; i++) {
            for (let j = 0; j < matrix.column; j++) {
                const randomData = Math.floor(Math.random() * 101);
                matrix.data[i][j] = randomData;
                document.getElementById(`cell${matrix.name}${i}${j}`).value = randomData;
            }
        }
    },
    resetClick: (matrix) => { // 행렬 초기화
        matrix.data = [];
        matrix.matrixArea.innerHTML = "";
        matrix.rowInput.value = "";
        matrix.columnInput.value = "";
    },
}

const operator = {
    setMatrix: (result) => { // 결과 행렬 사이즈 세팅
        if (matrixA.isReady && matrixB.isReady) {
            result.rowInput.value = matrixA.row;
            result.columnInput.value = matrixB.column;

            result.row = Number(result.rowInput.value);
            result.column = Number(result.columnInput.value);

            result.matrixArea.innerHTML = "";

            matrixFunctions.setData(result);
        } else {
            console.log("Isnt ready matrix");
        }
    },
    getPlusMinus: () => { // 더하기, 빼기가 가능한가
        return matrixA.row === matrixB.row && matrixA.column === matrixB.column;
    },
    getMultiple: () => { // 곱하기 가능한가
        return matrixA.column === matrixB.row;
    },
    plusClick: (result) => { // plus button
        if (operator.getPlusMinus()) {
            for (let i = 0; i < result.row; i++) {
                for (let j = 0; j < result.column; j++) {
                    result.data[i][j] = matrixA.data[i][j] + matrixB.data[i][j];
                }
            }
        } else {
            interfaceFunctions.alertWarning();
        }
    },
    minusClick: (result) => { // minus button
        if (operator.getPlusMinus()) {
            for (let i = 0; i < result.row; i++) {
                for (let j = 0; j < result.column; j++) {
                    result.data[i][j] = matrixA.data[i][j] - matrixB.data[i][j];
                }
            }
        } else {
            interfaceFunctions.alertWarning();
        }
    },
    multipleClick: (result) => { // multiple button
        if (operator.getMultiple()) {
            for (let i = 0; i < result.row; i++) {
                for (let j = 0; j < result.column; j++) {
                    for (let k = 0; k < matrixA.column; k++) {
                        //console.log(`${i} ${j} : ${matrixA.data[i][k]} ${matrixB.data[k][j]}`);
                        result.data[i][j] += matrixA.data[i][k] * matrixB.data[k][j];
                    }
                }
            }
        } else {
            interfaceFunctions.alertWarning();
        }
    },
    resultPrint: (result) => { // 배열 출력
        result.matrixArea.style.width = `${36 * result.column}px`;
        for (let i = 0; i < result.row; i++) {
            for (let j = 0; j < result.column; j++) {
                result.matrixArea.innerHTML += `<input id="cell${result.name}${i}${j}" class="cell cellDesign pointer" type="text" value="${result.data[i][j].toLocaleString("ko-KR")}" readonly />`;
            }
        }

    },
}

const interfaceFunctions = {
    footerContent: ( targetElement, inputString ) => {
        const targetDOM = document.getElementById( targetElement );
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        const letters = alphabet.toUpperCase() + alphabet + "0123456789@:-. ";
        let word = "";

        for (let i=0; i<inputString.length; i++) {
            for (let j=0; j<letters.length; j++) {
                setTimeout( ()=>{
                    targetDOM.innerHTML = `${word + letters[j]}`
                    //document.write( word + letters[j] + "<br>");
                    if ( inputString[i] === letters[j] ) {
                        word += letters[j];
                    }
                    
                }, i * 150 ); 
            }
        }
    },
    maxSizeMaker: (matrixs = []) => { // 내가 지정한 사이즈 보다 커지지 않게
        matrixs.forEach((matrix) => {
            matrix.rowInput.addEventListener("input", (event) => {
                matrix.rowInput.value = Number(event.target.value) > 10 ? 10 : Number(event.target.value);
                matrix.rowInput.value = Number(event.target.value) < 1 ? 1 : Number(event.target.value);
                matrix.rowInput.value = event.target.value === "-" ? "" : Number(event.target.value);

            });
            matrix.columnInput.addEventListener("input", (event) => {
                matrix.columnInput.value = Number(event.target.value) > 10 ? 10 : Number(event.target.value);
                matrix.columnInput.value = Number(event.target.value) < 1 ? matrix.columnInput.value = 1 : matrix.columnInput.value = Number(event.target.value);
                matrix.columnInput.value = event.target.value === "-" ? "" : Number(event.target.value);
            });
        });
    },
    cellException: (matrix) => { // cell 들에 대한 예외처리
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, index) => {
            cell.addEventListener("input", (event) => {
                console.log(event)
                if (event.data === "-" && event.target.value.length > 1 || "0123456789-null".indexOf(event.data) == -1) {
                    cell.value = cell.value.slice(0, -1);

                }
                if (Number(cell.value) > 100) {
                    cell.value = 100;
                }
                if (Number(cell.value) < -99) {
                    cell.value = -99;
                }
            });
        });

    },
    warningColor: () => { // 경고 팝업창 꾸미기
        const cells = document.querySelectorAll(".cell");
        const greenColor = "#3d4340";
        const borderGreen = "#2E8B5D";


        cells.forEach((cell) => {
            cell.style.color = "#CC6570";
            cell.style.borderColor = "#CC6570";
            cell.style.backgroundColor = "#8F1934";

            setTimeout(() => {
                cell.style.color = borderGreen;
                cell.style.borderColor = borderGreen;
                cell.style.backgroundColor = "#3d4340";
            }, "2000");
        });
    },
    popupManager: () => { // 경고 팝업창 띄우기
        const popup = document.getElementById("warningPopup");

        popup.style.display = "block";

        popup.addEventListener("click", () => {
            popup.style.display = "none";
        });
    },
    alertWarning: () => { // 경고 팝업창
        interfaceFunctions.warningColor();
        interfaceFunctions.popupManager();
    },
    RpopupManager: (  ) => { // 결과 행렬 팝업
        const resultPopup = document.getElementById("resultPopup");

        resultPopup.style.display = "block";

        resultPopup.addEventListener("click", () => {
            resultPopup.style.display = "none";
        });
    },
    resultPopupPrint: (result) => { // 결과 행렬 팝업 컨텐츠 채우기
        const resultPopupContent = document.getElementById("resultPopupContent");
        resultPopupContent.style.width = `${84 * result.column}px`;
        resultPopupContent.style.marginTop = `${ ( ( 500 - (36 * result.row) ) / 2 ) - 37 }px`
        resultPopupContent.innerHTML = "";
        for (let i = 0; i < result.row; i++) {
            for (let j = 0; j < result.column; j++) {
                resultPopupContent.innerHTML += `<input id="cellPopup${result.name}${i}${j}" class="resultPopupCell cellDesign pointer" type="text" value="${result.data[i][j].toLocaleString("ko-KR")}" readonly />`;
            }
        }
    },
    setFooter: () => {
	interfaceFunctions.footerContent( "nameArea",  "Juhwan Bae" );
        interfaceFunctions.footerContent( "callArea",  "010-2167-2204" );
        interfaceFunctions.footerContent( "emailArea",  "qo8373@naver.com" );
    },
}

const runningCalcMatrix = (matrix) => {
    matrix.printBtn.addEventListener("click", () => {
        matrixFunctions.printProcessor(matrix);
    });

    matrix.matrixArea.addEventListener("input", (event) => {
        matrixFunctions.updateData(matrix, event);
    });

    matrix.randomBtn.addEventListener("click", () => {
        matrixFunctions.printProcessor(matrix);
        matrixFunctions.randomClick(matrix);
    });

    matrix.resetBtn.addEventListener("click", () => {
        matrixFunctions.resetClick(matrix);

        matrix.isReady = false;
    });
}

const runningResultMatrix = (result) => {
    result.plusBtn.addEventListener("click", () => {
        operator.setMatrix(result)
        operator.plusClick(result);
        operator.resultPrint(result);

    });
    result.minusBtn.addEventListener("click", () => {
        operator.setMatrix(result);
        operator.minusClick(result);
        operator.resultPrint(result);
    });
    result.multipleBtn.addEventListener("click", () => {
        operator.setMatrix(result);
        operator.multipleClick(result);
        operator.resultPrint(result);
    });
    result.matrixArea.addEventListener("click", () => {
        interfaceFunctions.RpopupManager();
        interfaceFunctions.resultPopupPrint( result );
    });
}

runningCalcMatrix(matrixA);
runningCalcMatrix(matrixB);
runningResultMatrix(resultMatrix);

// about public function
interfaceFunctions.maxSizeMaker([matrixA, matrixB]);
interfaceFunctions.setFooter();
