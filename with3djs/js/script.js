var scoreData = []; // 악보 데이터 배열

var svg = d3.select("#score-container")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .style("background-color", "#f9f9f9")
    .style("border", "1px solid #ddd");

// 오선지 그리기 함수
function drawStaff() {
    var staffGroup = svg.append("g");

    // 오선지 라인 그리기
    for (var i = 0; i < 5; i++) {
        var y = i * 20 + 30;
        staffGroup.append("line")
            .attr("class", "staff-line")
            .attr("x1", 0)
            .attr("y1", y)
            .attr("x2", "100%")
            .attr("y2", y);
    }
}

// 악보 요소 그리기 함수
function drawScore() {
    var noteGroup = svg.append("g")
        .attr("class", "note-group");

    var notes = noteGroup.selectAll(".note")
        .data(scoreData);

    notes.enter()
        .append("circle")
        .attr("class", "note")
        .attr("cx", function (d) {
            return d.x;
        })
        .attr("cy", function (d) {
            return d.y;
        })
        .attr("r", 8)
        .on("mouseover", function () {
            d3.select(this).style("fill", "red");
        })
        .on("mouseout", function () {
            d3.select(this).style("fill", "steelblue");
        });

    notes.exit().remove();
}

// 악보 입력 함수
function addNote() {
    var y = 40; // 오선지의 첫 번째 라인 위치

    // 마우스 클릭 위치에 따라 오선지 라인의 y 좌표 계산
    svg.on("click", function () {
        var mousePos = d3.pointer(event);
        var mouseY = mousePos[1];
        var lineIndex = Math.floor((mouseY - 30) / 20);
        y = 30 + lineIndex * 20;

        var x = Math.floor(mousePos[0] / 20) * 20 + 10;

        scoreData.push({ x: x, y: y }); // 악보 데이터에 새 요소 추가
        drawScore(); // 악보 그리기
    });
}
// 파일로 악보를 저장하는 함수
function saveScore() {
    // 악보 데이터를 JSON 형식으로 변환
    var jsonData = JSON.stringify(scoreData);

    // 악보 데이터를 파일로 저장 (예시로 콘솔에 출력)
    console.log(jsonData);
}

// 초기화 함수
function init() {
    drawStaff(); // 오선지 그리기
    addNote(); // 악보 입력 함수 실행

    // Save 버튼 클릭 이벤트 핸들러 등록
    var saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", saveScore);
}

// 초기화 함수 호출
init();
