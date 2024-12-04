$(document).ready(function() {
    $('.loan-calculator').submit(function() {
        var act = $(this).attr('data-post');
        var form = new FormData($(this)[0]);
        form.append('act', act);
        $.ajax({
            url: site_url + 'common/loancalculator',
            type: 'post',
            dataType: 'json',
            data: form,
            contentType: false,
            processData: false,
            success: function(response) {
                $('.loading').hide();
                if (response.success) {
                    if (act == 'interest_pay_per_month') {
                        $('#myTabContent .tab-pane.active aside article .emi').html(response.data);
                        $('#myTabContent .tab-pane.active aside article .pamount').html(response.principal_amount);
                        $('#myTabContent .tab-pane.active aside article .ramount').html(response.total_interest_amount);
                        $('#myTabContent .tab-pane.active aside article .tamount').html(response.total_payable_amount);

                        chart(['Principal Amount', 'Interest Amount', 'Total Amount Payable'], [response.principal_amount, response.total_interest_amount, response.total_payable_amount]);
                    }
                }
            },
            error: function(err) {
                console.log('Error: ', err);
            }
        });
        return false;
    });
});

var doughnutChart = null;
function chart(labels, amounts) {
    const ctx2 = document.getElementById('doughnutChart').getContext('2d');
    var configure = {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                //label: 'Property Statics',
                data: amounts,
                backgroundColor: [
                    '#ff9800',
                    '#00a2ff',
                    '#7bb31a'
                ],
                borderColor: [
                    '#fff'
                ],
                cutout: '75%',
                hoverBorderColor: [
                    '#fff',
                ],
                hoverOffset: 10
            }]
        },
        options: {
            //responsive: true,
            plugins: {
                legend: {
                    position: 'bottom', //bottom / chartArea
                    align: 'start',
                    padding: 20,
                    labels: {
                        font: {
                            family: "Barlow",
                            size: 15,
                        },
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                title: {
                    display: true,
                    //text: 'Property Statics',
                    font: {
                        family: "Barlow",
                        size: 16,
                    }
                }
            }
        },
    };

    if (doughnutChart != null) {
        doughnutChart.destroy();
    }
    doughnutChart = new Chart(ctx2, configure);
}