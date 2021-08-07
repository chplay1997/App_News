 $(document).ready(function (){
    //biến chung
    var searchIcon = $("#search-icon");
    var searchBar = $("#search");
    var overFlow = $(".over-flow");
    var inputSearch = $("#input-search");
    var searchSubmit = $("#search-submit");
    var addHtml = $("#add-html");

    searchIcon.on("click",function(){
        overFlow.show();
        searchBar.css("display","block");
    })

    function close(){
        overFlow.hide();
        searchBar.hide("slow");
    }

    //Đóng bảng tìm kiếm
    $(".input-close").click(close);
    overFlow.click(close);
    $("#cancel").click(close);
    //Ẩn hiện thời gian
    function showSetDate(){
        if($("#selection-check:checked").length){
            $(".selec-date").css("display","flex");
            $(".search-footer").css("display","block");
        }
        else {
            $(".selec-date").css("display","none");
            $(".search-footer").css("display","none");
        }
    }
    $("input:checkbox").click(showSetDate);
    $("#btn-check").click(showSetDate);


    //Kiểm tra input type date cho IE10
    if ( $('[type="date"]').prop('type') != 'date' ) {
        $('[type="date"]').datepicker();   
    }

    //Hàm hiển thị
    function showNews(link){
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange =function(){
            if(this.readyState == 4 && this.status == 200){
                var html='';
                var data = JSON.parse(this.responseText);
                if(data.articles.length) {
                    $(data.articles).each(function(index,val){
                        html+=`
                                <div class="col-sm-12 col-md-4 view-pc">
                                    <img src="${val.image}" alt="">
                                </div>
                                <div class="col-sm-12 col-md-8 view-pc">
                                    <div>
                                        <a class="title-news" href="${val.url}" target="_blank">
                                            ${val.title}
                                        </a>
                                    </div>
                    
                                    <h6><i>${val.publishedAt}</i></h6>
                    
                                    <p>${val.description}</p> 
                                </div>
                            `
                    })
                }
                else{
                    html=`<h1 style="text-align: center;
                    margin-top: 35px;
                    color: brown;">Không tìm thấy gì hết, mời bạn tìm lại!</h1>`;
                }
                addHtml.html(html);
            }
            if(this.readyState < 4) {
                addHtml.html('<div class="loader"></div>');
            }

            if(this.status == 403 || this.status == 401){
                if(this.responseText){
                    var error = JSON.parse(this.responseText);
                    addHtml.html(`
                    <div class="col-sm-12" style="color: red;text-align: center;">
                    <h1>
                    Error: "${this.status}": "${error.errors}</h1>
                    <p style="word-break:break-word;">
                    <i>${this.responseURL}</i> </p>
                    </div>
                    `);
                }
            }

        };
        xhttp.open("GET" , link);
        xhttp.send();
    }
    //key click 400 lan
    //4c0de0bb019626abb763a8a99e205dc2
    //adf2e2e02c1c30a01f62080adf8e2267
    //c8b1209b6a21114c3300bbdfecb3d30a
    //3ee968e816e231a6b781985f7b5a3239

    //Hiển thị top heading
    var linkTopHeading = "https://gnews.io/api/v4/top-headlines?&token=4c0de0bb019626abb763a8a99e205dc2&lang=en";
    showNews(linkTopHeading);

    //Kiểm trả xem date1 có lớn hơn date2 ?
    function isDateCor(date1,date2) {
        if(Number( date1[0] ) > Number( date2[0] ) )
            return true;
        if(Number( date1[0] ) == Number( date2[0] ) && Number( date1[1] ) > Number( date2[1] ) )
            return true;
        if(Number( date1[0] ) == Number( date2[0] ) && Number( date1[1] ) == Number( date2[1] ) && Number( date1[2] ) > Number( date2[2] ) )
            return true;
        
        return false;
    }

    //Kiem tra keyword
    $("#search-focus").on("blur",function(){
        if(this.value.trim() == '') {
            $(this).addClass("invalid");
            this.value='';
            $(this).attr("placeholder","Bạn chưa nhập gì cả !");
        }
    })

    $("#search-focus").on("input",function(){
        $(this).removeClass("invalid");
        $(this).attr("placeholder","");
    });

    //Lấy ngày hiện tại
    var date = new Date();
    var currDay = [date.getFullYear(),(date.getMonth()+ 1)<10?"0"+(date.getMonth()+ 1):(date.getMonth()+ 1),date.getDate()<10?'0'+date.getDate():date.getDate()];
    //Đặt giới hạn chọn ngày
    $("#date-input-to").attr("max",currDay.join("-"));

    //Kiểm tra hợp lệ của ngày to va cảnh báo
    var checkDateTo =false;
    $("#date-input-to").on("blur",function (){
        if(isDateCor( $(this).val().split("-"),currDay) || $(this).val()=='') {
            $(this).addClass("invalid");
            $(this).next().text("Chưa hợp lệ !");
            checkDateTo =false;
        }
        else {
            checkDateTo =true;
            $(this).removeClass("invalid");
            $(this).next().text("");
            //Đặt giới hạn ngày from
            $("#date-input-from").attr("max",$("#date-input-to").val());
        }

        if(checkDateFrom) {
            if( !isDateCor( $(this).val().split("-"),$("#date-input-from").val().split("-") ) ) {
                $("#date-input-from").addClass("invalid");
                $("#date-input-from").next().text("Chưa hợp lệ !");
                checkDateFrom =false;
            }
        }
    });

    $("#date-input-to").on("keydown",removeWarning);

    //Kiểm tra hợp lệ của ngày from va cảnh báo
    var checkDateFrom =false;
    $("#date-input-from").on("blur",function (){
        if(checkDateTo) {
            if(isDateCor( $(this).val().split("-"),$("#date-input-to").val().split("-")) || $(this).val()=='') {
                $(this).addClass("invalid");
                $(this).next().text("Chưa hợp lệ !");
                checkDateFrom =false;
            }
            else {
                checkDateFrom =true;
                $(this).removeClass("invalid");
                $(this).next().text("");
            }
        }
        if(isDateCor( $(this).val().split("-"),currDay) || $(this).val()==''){
            $(this).addClass("invalid");
            $(this).next().text("Chưa hợp lệ !");
            checkDateFrom =false;
        }
        else {
            checkDateFrom =true;
            $(this).removeClass("invalid");
            $(this).next().text("");
        }
    });

    $("#date-input-from").on("keydown",removeWarning);


    //Xóa cảnh báo
    function removeWarning(ad) {
        $(this).removeClass("invalid");
        $(this).next().text("");
    }

    //Nhận dữ liệu search
    inputSearch.click(search);
    searchSubmit.click(search);
    function search(){
        // Lấy ngày from
        var inputFrom = $("#date-input-from").val().split("-");
        // Lấy ngày to
        var inputTo = $("#date-input-to").val().split("-");

        if($("#search-focus").val() == '') {
            $("#search-focus").addClass("invalid");
            $("#search-focus").attr("placeholder","Bạn chưa nhập gì cả !");
        }
        var isKeyWord = $("#search-focus").attr("class").toString().includes("invalid");

        if($("#selection-check:checked").length) {
            if(checkDateFrom && checkDateTo && !isKeyWord) {
                var linkSearch = 'https://gnews.io/api/v4/search?q='+$("#search-focus").val()+'&token=adf2e2e02c1c30a01f62080adf8e2267&lang=en&from='
                +$("#date-input-from").val()+'T00:00:00Z&to='+$("#date-input-to").val()+'T23:59:59Z';
                showNews(linkSearch);
                close();
            }
            if(!checkDateFrom){
                $("#date-input-from").addClass("invalid");
                $("#date-input-from").next().text("Chưa hợp lệ !");
            }
            if(!checkDateTo) {
                $("#date-input-to").addClass("invalid");
                $("#date-input-to").next().text("Chưa hợp lệ !");
            }
        }
        else {
            var linkSearch = 'https://gnews.io/api/v4/search?q='+$("#search-focus").val()+'&token=c8b1209b6a21114c3300bbdfecb3d30a&lang=en';
            showNews(linkSearch);
            close();
        }
    }

    //thanh nav mobile
    $("#mobile-nav").click(function(){
        overFlow.show();
        $(".list-nav").css("display","flex");
    })

    $(".fa-times").click(closeNavBar);
    overFlow.click(closeNavBar);
    function closeNavBar(){
        if(window.matchMedia('(max-width: 992px)').matches) {
            overFlow.hide();
            $(".list-nav").css("display","none");
        }
    }

    //Chạy link navbar
    var removeBg;
    $(".list-nav li").each(function(index,value){
        $(value).click(function(){
            closeNavBar();
            if(removeBg == this) {
                return;
            }
            else{
                $(removeBg).css("background-color","#000");
                $(removeBg).css("opacity","1");
                $(removeBg).css("color","#ffff");
                $(removeBg).hover(function(){
                    $(this).css("cursor","pointer");
                    $(this).css("background-color","#00f6fe");
                    $(this).css("color","#000");
                })
                $(removeBg).mouseleave((function(){
                    $(this).css("background-color","#000");
                    $(this).css("color","#ffff");
                }))
                
            }
            $(this).css("background-color","#00f6fe");
            $(this).css("color","#000");
            $(this).css("cursor","default");
            $(this).css("opacity","0.7");
            removeBg = this;
            var link = "https://gnews.io/api/v4/top-headlines?&token=3ee968e816e231a6b781985f7b5a3239&lang=en&topic=" + value.innerText.toLowerCase();
            showNews(link);
        })
    })

    //Thay doi man hinh thi an nav bar va luon hien o pc
    $(window).resize(function(){
        if(window.matchMedia('(min-width: 992px)').matches)
        {
            $(".list-nav").css("display","flex");
        }
        if(window.matchMedia('(max-width: 992px)').matches)
        {
            closeNavBar();
        }
    });
 })
