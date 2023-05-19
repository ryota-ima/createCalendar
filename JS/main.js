
//カレンダーを作成

//javascriptでの処理　{
  //今月分の日にちと月を取得
  //今月の末日と初日の曜日を求める
  //先月の末の週を取得
  //翌月の週初めの週を取得
  //先月末週と翌月週初め週と今月分を統合する
  //HTMLに反映させる
  //prevを取得しクリックしたら先月のカレンダーに切り替わる
  //nextを取得しクリックしたら翌月のカレンダーを取得
  //todayボタンをクリックしたら今月のカレンダーに戻る

//}

//現在時刻から年と月を取得
let today = new Date();
let year = today.getFullYear()
let month = today.getMonth();
const tbody = document.querySelector('tbody')
let holidayList = []




//今月の日にち取得して配列の中にオブジェクトとして格納する
const clenderBody = () => {
  const dates = [] 
  const lastDay = new Date(year, month + 1, 0).getDate();
  
  for(let i = 1; i<= lastDay; i++) {
    const day = i;

    const isHoliday = holidayList.some(holiday => {
      const holidayDate = new Date(holiday.date);
      return (
        holidayDate.getFullYear() === year && //祝日の年と指定された日時の年があっているか?
        holidayDate.getMonth() === month &&  //祝日の月と指定された日時の月があっているか?
        holidayDate.getDate() === day //祝日の日にちと指定された日時の日にちがあっているか?
      );
    });
  

    dates.push({
      day: i,
      isToday: false,
      isDisabled: false,
      isHoliday: isHoliday,
    })
  }
  return dates
}



//先月最終週を配列の中のオブジェクトに格納する
const clenderHead = () => {
  const dates = [];
  const lastDay = new Date(year, month, 0).getDate() //先月末日を取得
  const firstDate = new Date(year, month, 1).getDay() //今月1日の曜日を取得
  
  for(let i = 0; i< firstDate; i++) {
    dates.unshift({
      day: lastDay - i, //先月の最終週を計算
      isToday: false,  //今日の日付を真偽値で確認するためのキー
      isDisabled: true, //今月の日付かとどうかを真偽値で確認するためのキー
    })
  }
  return dates
}


//翌月の週初めの日付を配列の中のオブジェクトに格納する
const clenderEnd = () => {
  const dates = [];
  const firstDay = new Date(year, month +1, 1).getDay() //翌月の1に日の曜日を取得
  
  for(let i = 1; i<= 7 - firstDay; i++) {
    dates.push({
      day:  i,
      isToday: false,
      isDisabled: true,
    })
  }
  return dates
  
}

//titleを表示とカレンダーを初期化する処理をまとめる
const renderHead = () => {
  //tbody要素の子要素がある限りその子要素を削除
  
  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild)
  }
  
  //titleをHTMLに反映させる
  //title要素を取得
  const title = document.getElementById('title');
  
  title.textContent = `${year}/${String(month + 1).padStart(2,'0')}`
}

//HTMLにカレンダーを反映する関数
const renderBody = () => {
  const dates = [
    ...clenderHead(),
    ...clenderBody(),
    ...clenderEnd(),
  ]
  //週を7日で区切り、配列に格納する
  const weeks = [];
  const week = dates.length / 7 //datesの配列を7で割る

  //カレンダーを統合し配列の中のオブジェクトに格納する
  for(let i = 0; i < week; i++) {
    weeks.push(dates.splice(0, 7)) //月を7日間で区切り、weeksの配列に格納する処理
  }



  //HTMLに反映させる
  weeks.forEach(element => {
   //tr要素を生成
   const tr = document.createElement('tr');
   element.forEach(data => {
     //td要素を取得
     const td = document.createElement('td')
     tr.appendChild(td)
     if(data.isToday) {
       td.classList.add('today')
      }
      if(data.isDisabled) {
        td.classList.add('disabled')
      }
      if(data.isHoliday) {
        td.classList.add('horiday')
      }
      if(data.isHoliday) {
        td.classList.add('holiday')
      }
      
      td.textContent = data.day
    })
    //tbody要素を取得
    tbody.appendChild(tr)
})
}



// //祝日を判定する処理
const getHolidays = () => {
  return  new Promise((resolve) => {
    const csv = new XMLHttpRequest();
    csv.open("GET", "../syukujitsu.csv", true);
    csv.onreadystatechange = function () {
      if (csv.readyState === XMLHttpRequest.DONE && csv.status === 200) {
        const lines = csv.responseText.split("\n");
        holidayList = lines.slice(1).map(line => {
          const [date, name] = line.split(",");
          return { date, name };
        });
        resolve(holidayList)
      }
    };
    csv.send();
  })
};

const createCalendar = () => {
  renderHead();
  getHolidays()
  .then(() => {
    renderBody()
  })
  .catch(error => {
    console.error(error)
  })
};

createCalendar();

//prev要素クリックイベント
//prevの要素取得
const prev = document.getElementById('prev');
prev.addEventListener('click', () => {
  //先月のカレンダーを表示する処理
  month--;
  if(month < 0) {
    year--
    month = 11
  }
  createCalendar();
})

//next要素クリックイベント
//next要素取得
const next = document.getElementById('next');
next.addEventListener('click', ()=> {
  //翌月のカレンダー表示する処理
  month++;
  if(month > 11) {
    year++;
    month = 0
  }
  createCalendar();
})

 //todayボタンをクリックすると今月に戻る処理
    //today要素を取得
    const to = document.getElementById('today')
    to.addEventListener('click', ()=> {
      year = today.getFullYear()
      month = today.getMonth()
      createCalendar()
  })
    

  //tbodyの中身を取得
  const td = document.querySelectorAll('tbody tr > td');
  let count = 0; //初期値を変数として指定
  //カレンダーにメモ帳を追加
  td.forEach((t,index) => {
    t.addEventListener('click', ()=> {
      count = index
      if(t.classList.contains('disabled') ){
        t.disabled = true
      }else {
        alert(`クリックした日は${month + 1}/${count}です`)
      }
    })
  })

