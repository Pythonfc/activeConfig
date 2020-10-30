const CANCEL_URL = ROUTE_PREFIX + '/docker_dataBoard/config/index';
const ONSUBMIT_URL = ROUTE_PREFIX + '/docker_dataBoard/config/save';
const ONTOUCH_URL = ROUTE_PREFIX + '/docker_dataBoard/config/getSidInfo';
const AUTOWRITE_URL = ROUTE_PREFIX + '/docker_dataBoard/config/businessList';
const COUPONINFO_URL = ROUTE_PREFIX + '/docker_dataBoard/config/couponInfo';
const GETLISTBYTYPE_URL = ROUTE_PREFIX + '/docker_dataBoard/config/getListByType';

Vue.http.options.emulateJSOPN = true
Vue.http.options.headers = {
    'Content-Type': 'application/json'
}
var Main = {
    data() {
        return {
            numKey:[],
            act01:[],
            act02:[],
            aim01: [],
            aim02: [],
            yuqi01:'',
            yuqi02:'',
            allData: '',
            cityOptions: [],
            textarea: '',
            checkboxGroup: [],
            cities: [],
            zhouqi: '123123123',
            activeName: '',
            activeTimes: [],
            emailSubscribe: '',
            businessId: '',
            productNames: '',
            productName: [],
            activeTypes: '',
            activeType: [],
            keyValues: {},
            departments: '',
            department: [],
            id: '',
            sidList: {},
            promotionPriceIds: '',
            promotionPriceId: [],
            type: '',
            sjbid:[],
            renzheng:[],
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            form: {
                department: '',
                activeName: '',
                activeType: '',
                checkboxGroup: [],
                textarea: '',
                productName: '',
                promotionPriceId: [],
                activeTime: '',
                emailSubscribe: false
            }
        }
    },
    methods: {
        // 判断是否是数字
        isNumber(val) {
            var regPos = /^\d+(\.\d+)?$/; 
            var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; 
            if(regPos.test(val) || regNeg.test(val)) {
                return true;
                } else {
                return false;
                }
        },
        // 数字校验
        jiaoYan01(val){
            if(this.isNumber(val.target.value) == false){
                this.$message({
                    type:'error',
                    message:'预期值只能为数字,请重新填写'
                })
                this.yuqi01 = ''
            }
        },
        jiaoYan02(val){
            if(this.isNumber(val.target.value) == false){
                this.$message({
                    type:'error',
                    message:'预期值只能为数字,请重新填写'
                })
                this.yuqi02 = ''
            }
        },
        activeAim01(val) { 
            try {
                let n = val.length
                if(n >= 2){
                    this.$message({
                        type:'error',
                        message:'最多只能选两个'
                    })
                    this.aim01.splice(2, n-2)
                    return;
                }
            } catch (error) {}
        },
        activeAim02(val) { 
            try {
                let n = val.length
                if(n >= 2){
                    this.$message({
                        type:'error',
                        message:'最多只能选两个'
                    })
                    this.aim02.splice(2, n-2)
                    return;
                }
            } catch (error) {}
        },
        clear() {
            let charge = document.getElementsByName('charge');
            for (var i = 0; i < charge.length; i++) {
                charge[i].style.display = 'none'
            }
        },
        onTouch() {
            let charge = document.getElementsByName('charge');
            if (this.productNames.length > 0 || window.location.href.includes('=') == true) {
                for (var i = 0; i < this.productNames.length; i++) {
                    for (var key in this.keyValues) {
                        if (this.productNames[i] == this.keyValues[key]) {
                            this.$http.get(ONTOUCH_URL, { params: { sid: key } }, { emulateJSON: true }).then(function (res) {
                                this.sidList = res.body.list
                                this.promotionPriceIds = res.body.list.activityId
                                if (this.activeTimes.length < 1) {
                                    this.activeTimes.push(res.body.list.startTime)
                                    this.activeTimes.push(res.body.list.endTime)
                                }
                            }, function (reason) { console.log(reason) });
                        }
                    }
                }
            }


        },
        getValueActiveType(value) {
            let charge = document.getElementsByName('charge');
            var idKey
            for (var j = 0; j < this.activeType.length; j++){
                this.activeType[j].name.includes(value) == true ? idKey = this.activeType[j].key : (()=>{
                    this.$message({
                        type:'error',
                        message:'没有此活动类型的数据'
                    })
                    return 
                })
            }
            this.clear()
            if (value.startsWith('收费') == true ) {
                for (var i = 0; i < charge.length; i++) {
                    if (i != 7 && i != 8 && i != 9 && i != 10 && i != 11) {
                        charge[i].style.display = 'block'
                    }
                }
                this.$http.get(COUPONINFO_URL,{ params:{
                    type:idKey
                }}).then((res)=>{
                    try {
                        let d = res.body.list || ''
                        this.act01= d.object1
                        this.act02= d.object2
                    } catch (error) {
                        
                    }
                },(reason) = {
                })
                // 认证中心申请活动名称
                this.$http.get(GETLISTBYTYPE_URL, {
                    params:{
                        type:idKey
                    }
                }).then((res)=>{
                    this.productName = []
                    try {
                        let d = res.body.list || ''
                        for (keys in d.productList){
                            this.productName.push(d.productList[keys])
                        }
                        this.renzheng = d.productList
                        this.sjbid = d.activityList
                    } catch (error) {
                        
                    }
                },(reason) = {
                })
            } else {
                this.$http.get(COUPONINFO_URL,{ params:{
                    type:idKey
                }}).then((res)=>{
                    try {
                        let d = res.body.list || ''
                        this.act01= d.object1
                        this.act02= d.object2
                    } catch (error) {
                        
                    }
                },(reason) = {
                })
                for (var i = 0; i < charge.length; i++) {
                    if (i != 5 && i != 6 && i != 7 && i != 8 && i != 9 && i != 10) {
                            charge[i].style.display = 'block'
                    }
                }
            }
        },
        getValueProductName() {
            for (keys in this.sjbid){
                for (key in this.renzheng){
                    if (this.renzheng[keys] == this.productNames && keys == key){
                        this.numKey = this.sjbid[keys]
                    }
                }
            }
            this.promotionPriceId = []
            for (k in this.numKey){
                this.promotionPriceId.push(k)
            }
        },
        findSid() {
            for (var key in this.allData) {
                if (this.allData[key] == this.productNames) {
                    return key
                }
            }
        },
        getValuePriceId(val) {
            let charge = document.getElementsByName('charge');
            for (var i = 0; i < charge.length; i++) {
                (i != 4) ? charge[i].style.display = 'block' : ''
            }
            this.sidList = []
            for (keys in this.numKey){
                if (val == keys){
                    this.sidList = this.numKey[keys]
                }
            }
        },
        cancel() {
            window.location.href = CANCEL_URL
        },
        onSubmit() {
            if (this.departments) {
                for (var i = 0; i < this.department.length; i++) {
                    (this.departments == this.department[i].businessName) ? this.businessId = this.department[i].businessId : ''
                }
            }
            try {
                var aim01 = this.aim01.join()
                var aim02 = this.aim02.join()
            } catch (error) {
                
            }
            this.$confirm('确认提交吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.type.startsWith('收费') == true){
                    this.$http.get(ONSUBMIT_URL, {
                        params: {
                            business: this.departments,
                            businessId: this.businessId,
                            id: this.id,
                            name: this.activeName,
                            type: this.activeTypes,
                            objective: this.checkboxGroup,
                            object01:aim01,
                            object02:aim02,
                            expect01:this.yuqi01,
                            expect02:this.yuqi02,
                            description: this.textarea,
                            productName: this.productNames,
                            sid: this.sidList.sid,
                            salePriceId: this.promotionPriceIds,
                            period: this.sidList.period,
                            activityPrice: this.sidList.activityPrice,
                            originalPrice: this.sidList.originalPrice,
                            startTime: this.activeTimes[0],
                            endTime: this.activeTimes[1],
                            mailNotice: this.form.emailSubscribe == true ? 1 : 0,
                            type: this.type
                        }
                    }).then(function (res) {
                        this.$notify({
                            title: 'Success!',
                            message: '提交成功',
                            type: 'success',
                        })
                        var delayTime = setTimeout(() => { window.location.href = CANCEL_URL }, 1000);
                    }, function (reason) {
                        this.$notify.error({
                            title: '错误',
                            message: '出了点问题，请查看是否填写完整'
                        })
                    });
                } else {
                    this.$http.get(ONSUBMIT_URL, {
                        params: {
                            business: this.departments,
                            businessId: this.businessId,
                            id: this.id,
                            name: this.activeName,
                            type: this.activeTypes,
                            objective: this.checkboxGroup,
                            object01:aim01,
                            object02:aim02,
                            expect01:this.yuqi01,
                            expect02:this.yuqi02,
                            description: this.textarea,
                            startTime: this.activeTimes[0],
                            endTime: this.activeTimes[1],
                            mailNotice: this.form.emailSubscribe == true ? 1 : 0,
                            type: this.type
                        }
                    }).then(function (res) {
                        this.$notify({
                            title: 'Success!',
                            message: '提交成功',
                            type: 'success',
                        })
                        var delayTime = setTimeout(() => { window.location.href = CANCEL_URL }, 1000);
                    }, function (reason) {
                        this.$notify.error({
                            title: '错误',
                            message: '出了点问题，请查看是否填写完整'
                        })
                    });
                }
            }).catch(() => {
                this.$notify.error({
                    title: '未知',
                    message: '您未提交数据哦~'
                })
            })
        },
        autoWrite() {
            let charge = document.getElementsByName('charge');
            this.$http.get(AUTOWRITE_URL, { emulateJSON: true }).then(function (res) {

                for (var i = 0; i < res.body.data.businessList.length; i++) {
                    this.department.push(res.body.data.businessList[i])
                }
                this.allData = res.body.data.productList
                for (var i = 0; i < res.body.data.objectiveList.length; i++) {
                    this.cityOptions.push(res.body.data.objectiveList[i])
                }
                this.cities = this.cityOptions
                for (var i = 0; i < res.body.data.typeList.length; i++) {
                    this.activeType.push(res.body.data.typeList[i])
                }
            }, function (reason) {
                console.log('失败原因:' + reason);
            });
            if (window.location.href.includes('=') == true) {
                for (var i = 0; i < charge.length; i++) {
                    charge[i].style.display = 'block'
                }
                this.businessId = this.getCaption('businessId')
                this.id = this.getCaption('id')
                this.activeName = this.getCaption('activeName')
                this.checkboxGroup.push(this.getCaption('checkboxGroup01'))
                this.checkboxGroup.push(this.getCaption('checkboxGroup02'))
                this.checkboxGroup.push(this.getCaption('checkboxGroup03'))
                this.checkboxGroup.push(this.getCaption('checkboxGroup04'))
                this.type = this.getCaption('type')
                this.aim01 = this.getCaption('object01').split(',')
                this.aim02 = this.getCaption('object02').split(',')
                this.yuqi01 = this.getCaption('expect01')
                this.yuqi02 = this.getCaption('expect02')
                this.checkboxGroup = this.checkboxGroup.filter(function (s) {
                    return s && s.trim();
                })
                this.textarea = this.getCaption('textarea')
                this.promotionPriceIds = this.getCaption('promotionPriceIds')
                this.departments = this.getCaption('departments')
                this.productNames = this.getCaption('productNames')
                this.sidList = { sid: this.getCaption('sid'), period: this.getCaption('period'), activityPrice: this.getCaption('activityPrice'), originalPrice: this.getCaption('originalPrice') }
            }
        },
		// get 请求获取获取每个等号前面的值
        getCaption(name) {
            var ff = decodeURI(window.location.search.substring(1))
                , index = ff.lastIndexOf('\=');
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
            var r = ff.match(reg)
            if (r != null) return unescape(r[2]); return null
        }
    },
    created: function () {
        this.autoWrite()
    },
}
var Ctor = Vue.extend(Main)
new Ctor().$mount('#app')