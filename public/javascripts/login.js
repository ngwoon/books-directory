(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    const input = $('.validate-input .input100');

    console.log($);

    $('.validate-form').submit(function(event) {

        event.preventDefault();

        let check = true;
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check) {
            const username = $('input[name="username"]').val();
            const password = $('input[name="pass"]').val();

            $.ajax({
                url: "/users/login",
                async: true,
                dataType: "json",
                type: "POST",
                data: {
                    username: username,
                    pass: password,
                },
                success: (data) => {
                    console.log(data);
                    if(data.state === "fail") {
                        $('.fail').addClass(".alert-fail");
                    }
                    else {
                        location.href = data.href;
                    }
                },
                error: (req, state, error) => {
                    alert(error);
                    console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                },
            });
        }
    });

    console.log($);


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);