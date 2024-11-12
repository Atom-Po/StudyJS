$(document).ready(function () {
  // 차트 초기화
  const ctx = document.getElementById("myChart").getContext("2d");
  let chartData = [];

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.map((_, i) => i + 1),
      datasets: [
        {
          label: "Dynamic Data",
          data: chartData,
          borderColor: "#8c52ff",
          borderWidth: 2,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // true로 설정 시 차트가 반으로 잘리는 문제... 왜지?ㅏ
      plugins: {
        background: {
          color: "white",
        },
      },
    },
    plugins: [
      {
        id: "whiteBackground",
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, chart.width, chart.height);
          ctx.restore();
        },
      },
    ],
  });

  // 차트 업데이트 함수
  function updateChart() {
    chart.data.labels = chartData.map((_, i) => i + 1);
    chart.data.datasets[0].data = chartData;
    chart.update();
  }

  // 숫자 추가 함수
  function addNumber(value) {
    chartData.push(value);
    updateChart();
    renderNumberList();
  }

  // 숫자 삭제 함수
  function deleteNumber(index) {
    chartData.splice(index, 1);
    updateChart();
    renderNumberList();
  }

  // 숫자 목록 렌더링
  function renderNumberList() {
    $("#numberList").empty();
    chartData.forEach((num, index) => {
      const formattedNumber = new Intl.NumberFormat().format(num); // 숫자 형식 지정
      const numberItem = $(`
                <div class="number-item" data-index="${index}">
                    <span class="number-text">${formattedNumber}</span>
                    <span class="delete-btn">x</span>
                </div>
            `);
      numberItem.find(".delete-btn").click(function () {
        deleteNumber(index);
      });

      $("#numberList").append(numberItem);

      // 글자 크기 조절 함수 호출
      adjustFontSize(numberItem.find(".number-text"));
    });

    // 드래그 앤 드롭 기능 추가
    $(".number-list").sortable({
      update: function () {
        const newOrder = [];
        $(".number-item").each(function () {
          const originalIndex = $(this).data("index");
          newOrder.push(chartData[originalIndex]);
        });
        chartData = newOrder;
        updateChart();
      },
    });
  }

  // 글자 크기 조절 함수
  function adjustFontSize(element) {
    let fontSize = 16; // 기본 글자 크기 설정
    element.css("font-size", fontSize + "px");

    // 글자가 부모 요소보다 넘칠 때까지 반복
    while (element[0].scrollWidth > element.parent().width() && fontSize > 8) {
      fontSize -= 1;
      element.css("font-size", fontSize + "px");
    }
  }

  // + 버튼 클릭 이벤트
  $("#addButton").click(function () {
    const value = parseInt($("#numberInput").val());
    if (!isNaN(value)) {
      addNumber(value);
      $("#numberInput").val("");
    }
  });

  // 엔터 키 입력시 추가
  $("#numberInput").keypress(function (e) {
    if (e.which === 13) {
      $("#addButton").click();
    }
  });
});
