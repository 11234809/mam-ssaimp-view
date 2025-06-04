import { defineStore, acceptHMRUpdate } from "pinia";
import {
    getServiceAreaInfo,
    addServiceAreaInfo,
    editServiceAreaInfo,
    getCompany,
    getOrg,
    getDictItems,
    getRoad,
    getRoadLine,
    getCompanyManager,
    startProcessInterface,
    processCompletedInterface,
    getServiceArealnfoList,
} from "../api/informationServiceAreaApi";
import { ElMessage, ElLoading } from "element-plus";

export const useAreaInfoStore = defineStore("area-info-id", {
    state: () => ({
        formInfoDisabled: false,
        flag: "",
        formInfo: {
            auditStatus: "",
            basicBean: {
                name: null,
                code: null,
                type: null,
                longitude: null,
                latitude: null,
                brief: null,
                province: '',
                city: '',
                county: '',
                layoutForm: null,
                serviceMode: null,
                serviceAreaDirection: null,
                directionName: null,
                highSpeed: null,
                highCode: null,
                company: null,
                auditUserId: null,
                startTollStation: null,
                endTollStation: null,
                road: null,
                roadType: null,
                locationPileNo: null,
                operationTime: null,
                builtTime: null,
                star: null,
                ownership: null,
                businessUnits: null,
                unitNature: null,
                isWholeYear: null,
                isWholeDay: null,
                isOpenService:0,
                isSpecService:0,
                isVehicleCount: null,
                isVehicleAuto: null,
                isFarmerMode: null,
                farmerMode: null,
                isTruckHome: null,
                truckHome: null,
                isTwoWay: null,
                isTheme: null,
                area: null,
                consultationTel: null,
                remark: null,
                status: null,
                abnormalReason: null,
                isShow: null,
                side: null,
                files: null,
                manageCompany: null,
            },
            areaBean: {
                totalRoomNum: null,
                totalArea: null,
                coversArea: null,
                buildArea: null,
                greenArea: null,
                parkingLotArea: null,
                staffDormitoryArea: null,
                maintenanceArea: null,
                gasArea: null,
                petrolArea: null,
                chargingArea: null,
                parkingTruckArea: null,
                parkingPassengerArea: null,
                marketArea: null,
                cateringArea: null,
                warehousingArea: null,
                guestArea: null,
                freeArea: null,
            },
            babyBean: {
                isMotherBaby: null,
                motherBabyNum: null,
                motherBabyArea: null,
                isMotherBabyToilet: null,
                isMotherBabyRest: null,
            },
            carBean: {
                isParking: null,
                isPassengerStop: null,
                largeTruck: null,
                buses: null,
                smallCars: null,
                dangerousGoodsCarrier: null,
                livestockTruck: null,
                electricCar: null,
                trailer: null,
                limo: null,
                reservedElectricCar: null,
                femaleCar: null,
                barrierFreeCar: null,
            },
            energyBean: {
              isChargingStation: '1',// 是否有充电站 0没有 1有
              chargeStationList:[{ // 充电站列表
                stationId: null,// 充电站ID
                stationName: null,// 充电站名称
                stationAddress: null,// 充电站地址
                longitude: null,// 经度
                latitude: null,// 纬度
                transformerCapacity: null,// 箱变容量（kVA）
                ratedTotalPower: null,// 额定总功率（kW）
                isIntegratedStorage: '0',// 是否为充储一体化站 0否 1是
                energyStorageCapacity: null,// 储能配置规模（kWh）
                dischargeDuration: null,// 放电时间（h）
                hasSolarPower: '0',// 是否有光伏供能 0否 1是
                solarPowerCapacity: null,// 光伏配置规模（kWp）
                isV2gStation: '0',// 是否为V2G充电站 0否 1是
                v2gStationType: null,// V2G充电站类型
                v2gPileCount: null,// V2G充电桩数量
                v2gDischargePower: null,// V2G放电功率（kW）
                cameraCount: null,// 充电站摄像机数量
                hasCanopy: "1",// 是否有车棚 0否 1是
                stationStatus: null,// 充电站状态
                stationType: null,// 充电站类型
                parkingFeeType: null,// 停车费类型
                is24HoursOperation: '1',// 是否24小时开放 0否 1是
                paymentMethods: [],// 支付方式 多个逗号分隔
                stationPhone: null,// 充电站电话
                servicePhone: null,// 服务电话
                constructionLocation: null,// 建设场所
                surroundingEnvironment: null,// 周边环境
                surroundingFacilities: [],// 周边设施 多个逗号分隔
                builtTime: null,// 建设时间
                commissioningTime: null,// 启用时间
                stationPhotosList : [],// 充电站照片 多个逗号分隔
                }],
                chargePileList:[{ // 充电桩列表
                  serviceAreaId: null,// 服务区域ID
                  stationName: null,// 充电站名称
                  chargerCount: null,// 充电桩数量
                  deviceCode: null,// 设备编码
                  deviceName: null,// 设备名称
                  deviceType: null,// 设备类型
                  totalPower: null,// 充电设备总功率（kW）
                  maxPower: null,// 充电设备最大功率（kW）
                  gunCount: null,// 充电枪数量
                  voltageRange: null,// 电压范围
                  manufacturer: null,// 生产厂家
                  maxCurrent: null,// 充电设备最大电流（A）
                  builtTime: null,// 建设时间
                  operationTime: null,// 运营时间
                  gunImagesList: [],// 充电桩充电枪数图片（最多3张）
                  nameplateImagesList: [],// 充电桩铭牌图片（最多3张）
                  inspectionReportImagesList: [],// 第三方检测报告（最多3张）
                  chargeGunList:[// 充电枪列表
                    { 
                      interfaceCode: null,// 充电设备接口编码
                      interfaceName: null,// 充电设备接口名称
                      isLinkedToCheck: null,// 是否与第三方检测系统对接 0否 1是
                    }
                  ]
                }]
            },
            etcBean: {
                isEtc: null,
                etcLaneNum: null,
                etcCarType: null,
                inLaneNum: null,
                outLaneNum: null,
            },
            fireBean: {
                isFire: null,
                isBunker: null,
                kitchenDesc: null,
                boothDesc: null,
            },
            foodBean: {
                isFoodBeverage: null,
                restaurantArea: null,
                restaurantNum: null,
                mainCuisine: null,
                restaurantRoomNum: null,
                mealsNum: null,
                specialtyStore: null,
                mealsKinds: null,
            },
            freeBean: {
                isFreeRest: null,
                isHotWater: null,
                freeSeatNum: null,
                waterFaucetNum: null,
            },
            garageBean: {
                isGarage: null,
                garageRunBusiness: null,
                garageBusinessScope: null,
                isPracticeArea: null,
                garageRoomNum: null,
                garageWorkerNum: null,
                personInChargeGarage: null,
                telephoneGarage: null,
            },
            greenBean: {
                sewageMode: null,
                runningDate: null,
                dailyMaxCapacity: null,
                dailyRealCapacity: null,
                garbageNum: null,
                garbageClassifyNum: null,
                isWaterStandard: null,
                isSewageDetection: null,
                isGarbageClassify: null,
                isGarbageHarmless: null,
                isWaterReuse: null,
                isGarbageRecovery: null,
                isGreenEnergy: null,
                greenEnergy: null,
            },
            infoBean: {
                isInfoPublish: '1', //  是否有信息发布系统 0否1是
                isServiceSatisfaction: '1', // 是否开展服务质量满意度检查 0否1是
                isBroadcastSystem: '1', // 是否设有广播呼叫系统 0否1是
                isMultiMedia: '1',// 是否设置多媒体信息发布终端 0否1是
                isOnline: '1',// 是否通过互联网发布服务 0否1是
                isInfoQuery: '1', // 是否设置信息查询设置 0否1是
                basServiceAreaInfoPublishList:[{
                  equipmentNum:null, // 设备编号
                  equityUnit:null,// 产权单位
                  useUnit:null,// 使用单位
                  useClass:null,// 使用分类
                  equipmentClass:null,// 设备分类
                  displaySize:null,// 显示尺寸
                  displayArea:null,// 显示屏面积（平方米）
                  signalNetwork:null,// 信号网络方式
                  site:null,// 位置
                  equipmentProducer:null,// 设备生产商
                  softwareControlSystem:null,// 软件控制系统
                  infoPublishControlSystem:null,// 信息发布控制方式
                  sceneManagePerson:null,// 现场管理负责人及联系方式
                  infoAuditPerson:null,// 信息审核责任领导及联系方式
                  infoPublishPerson:null,// 信息发布责任领导及联系方式
                }]
            },
            limoCampBean: {
                isLimoCamp: null,
                limoCampNum: null,
                isBasicService: null,
                isTelBook: null,
                isOnlineBook: null,
            },
            marketBean: {
                isSupermarket: null,
                supermarketRunBusiness: null,
                supermarketBusinessScope: null,
                supermarketArea: null,
                samePriceGoods: null,
                localCharacteristicsGoods: null,
                personInChargeMarket: null,
                telephoneMarket: null,
            },
            medicalBean: {
                isMedicalService: null,
                isMedicalStation: null,
                isMedicalEmergency: null,
                isNonPrescriptionDrugs: null,
            },
            monitorBean: {
                isMonitor: null,
                cameraNum: null,
                highCameraNum: null,
                lowCameraNum: null,
            },
            officeBean: {
                officeArea: null,
                officeRoomNum: null,
            },
            personBean: {
                managePersonNum: null,
                assistNum: null,
                securityGuardNum: null,
                procterGambleNum: null,
                cateringStaffNum: null,
                salesmanNum: null,
                electricianNum: null,
                gasStationPerson: null,
                ableAccommodationNum: null,
                ownerManageNum: null,
                operateManageNum: null,
                operateServiceNum: null,
                informationNum: null,
                guaranteeNum: null,
            },
            rescueBean: {
                isRescue: null,
                isRescueBarrier: null,
                isRescueCall: null,
                isRescueApron: null,
            },
            roomBean: {
                isAccommodation: null,
                guestRoomNum: null,
                standardRoomNum: null,
                bedsNum: null,
            },
            showerBean: {
                isShower: null,
                showerNum: null,
                manShowerNum: null,
                womanShowerNum: null,
            },
            superviseBean: {
                isSupervise: null,
                isSuperviseBoard: null,
                isSuperviseTel: null,
                isComplaintDesk: null,
            },
            toiletBean: {
                isToilet: null,
                manUrinalNum: null,
                manHoleNum: null,
                manSeatThenNum: null,
                womanHoleNum: null,
                womanSeatThenNum: null,
                accessibleToiletNum: null,
                thirdToiletNum: null,
                thirdSeatNum: null,
                mobileToiletSquatNum: null,
            },
            waterBean: {
                isAddWater: null,
                waterGunNum: null,
                operateWater: null,
                personInChargeWater: null,
                telephoneWater: null,
            },
            electricityBean:{
              projectEntity:null, // 项目法人
              constructionUnit:null, // 建设单位
              constructionState:null, // 建设状态
              photoType:null, // 类型  独立光伏 0/分布式光伏 1
              photoScene:null, // 光伏场景
              synchronizeMode:[], // 并网模式 自发自用0；自发自用1，余电上网2；全额上网3
              isEnergyDevice:null, // 是否有储能设备
              totalPhotoCapacity:null, // 光伏设备总容量（千瓦）
              totalEnergyCapacity:null, // 储能设备总容量（千瓦）
              annualAverageCapacity :null, // 年平均容量（千瓦）
              annualAverageHours :null, // 年均发电小时
              annualAverageOnlineCapacity :null, // 年均上网电量（千瓦时）
              actualTime :null, // 建成投用时间
              gridConnectionTime :null, // 并网时间
              gridConnectionVoltageLevel :null, // 并网电压等级
              note :null, // 备注
            },
            driverHouseBean:{
              isHome:'0', // 是否建设货车“司机之家 0否1是
              distance:null, // 距离重庆主城距离（KM）
              homeArea:null, // 司机之家房屋面积（m2）
              totalNum:null, // 能同时容纳人数
              annualPersonNum:null, // 年人均使用人数
              serviceFunction:[], // 司机之家”服务功能
              description:null, // 简要说明
              descriptionImageList:[], // 图片
              isStandardDesign:null, // 是否按照标准设计打造 0否1是
              isPass:null, // 是否通过验收 0否1是
              constructedUnit:null, // 投建单位
              constructedCost:null, // 投资建设费用
              manageUnit:null, // 管理单位
              sitePrincipal:null, // 现场负责人
              sitePrincipalTel:null, // 现场负责人电话
              buildTime:null, // 建成时间
              isStation:"0", // 是否为同心驿站 0否1是
              specialService:null, // 特色服务
              specialServiceImageList:[] // 特色服务图片
            }
        },
        validatorRules: {
            //必填项
            auditstatus: [{ required: true, message: "请选择!" }],
            basicBean: {
                isWholeDay: [{ required: true, message: "请选择!" }],
                isOpenService:[{ required: true, message: "请选择是否开放式服务区!" }],
                isSpecService:[{ required: true, message: "请选择是否特色服务区!" }],
                isWholeYear: [{ required: true, message: "请选择!" }],
                isTheme: [{ required: true, message: "请选择!" }],
                isTwoWay: [{ required: true, message: "请选择!" }],
                isVehicleCount: [{ required: true, message: "请选择!" }],
                isShow: [{ required: true, message: "请选择!" }],
                isVehicleAuto: [{ required: true, message: "请选择!" }],
                type: [{ required: true, message: "请选择服务区类别!" }],
                brief: [{ required: true, message: "请选择服务区简介!" }],
                code: [{ required: true, message: "请选择服务区编号!" }],
                directionName: [{ required: true, message: "请选择服务区方向名称!" }],
                side: [{ required: true, message: "请选择左右侧!" }],
                area: [{ required: true, message: "请选择道路方向!" }],
                star: [{ required: true, message: "请选择服务区星级!" }],
                serviceAreaDirection: [{ required: true, message: "请选择服务区方向!" }],
                name: [
                    { required: true, message: "请输入服务区名称!" },
                    {
                        validator: (rule, value, callback) => {
                            if (
                                value.indexOf("区") == -1 ||
                                (value.indexOf("进城") == -1 && value.indexOf("出城") == -1)
                            ) {
                                callback("名称应包括’进城’或者’出城’以及’区’,例如:’XX服务区(进城)’");
                            } else {
                                callback();
                            }
                        },
                    },
                ],
                layoutForm: [{ required: true, message: "请选择布局形式!" }],
                longitude: [{ required: true, message: "请输入经度!",pattern: /^(?:\d+|\d*\.\d{1,6})$/, trigger: "blur", }],
                latitude: [{ required: true, message: "请输入纬度!" ,pattern: /^(?:\d+|\d*\.\d{1,6})$/, trigger: "blur", }],
                province: [{ required: true, message: "请输入省!" }],
                city: [{ required: true, message: "请输入市!" }],
                businessUnits: [{ required: true, message: "请输入经营管理单位名称!" }],
                unitNature: [{ required: true, message: "请输入经营管理单位性质!" }],
                serviceMode: [{ required: true, message: "请输入经营管理模式!" }],
                consultationTel: [
                    {
                        required: true,
                        pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
                        message: "请输入数字",
                        trigger: "blur",
                    },
                ],
                highCode: [{ required: true, message: "请输入所在路线编号!" }],
                highSpeed: [{ required: true, message: "请输入所在路线名称!" }],
                company: [{ required: true, message: "请选择所属公司!" }],
                auditUserId: [{ required: true, message: "请选择下一步处理人!" }],
                startTollStation: [{ required: true, message: "请选择起始收费站!" }],
                endTollStation: [{ required: true, message: "请选择结束收费站!" }],
                road: [{ required: true, message: "请选择所属路段名称!" }],
                roadType: [{ required: true, message: "请选择所属路段类型!" }],
                operationTime: [{ required: true, message: "请选择初始运营日期!" }],
                locationPileNo: [{ required: true, message: "请输入位置桩号!" }],
                coversArea: [{ required: true, message: "请输入占地面积!" }],
                buildArea: [{ required: true, message: "请输入建筑面积!" }],
                greenArea: [{ required: true, message: "请输入绿化!" }],
                parkingLotArea: [{ required: true, message: "请输入停车场面积!" }],
                builtTime: [{ required: true, message: "请选择建成时间!" }],
                ownership: [{ required: true, message: "产权隶属单位!" }],
                auditStatus: [{ required: true, message: "请选择审核状态!" }],
                status: [{ required: true, message: "请选择状态!" }],
                isTruckHome: [{ required: true, message: "请选择!" }],
                isFarmerMode: [{ required: true, message: "请选择!" }],
                // files: [{ required: true, message: '请选择平面图!' }],
                abnormalReason: [{ required: true, message: "请输入异常原因!" }],
                truckHome: [{ required: true, message: "请输入“司机之家”配套设施!" }],
                farmerMode: [{ required: true, message: "请输入助农兴农农副产品营销方式!" }],
            },
            personBean: {},
            officeBean: {
                officeArea: [{ required: true, message: "请输入办公区总面积!" }],
                officeRoomNum: [{ required: true, message: "请输入办公区房间数!" }],
            },
            areaBean: {},
            carBean: {
                isParking: [{ required: true, message: "请选择!" }],
                isPassengerStop: [{ required: true, message: "请选择!" }],
                buses: [{ required: true, message: "请输入大客车位数量!" }],
                largeTruck: [{ required: true, message: "请输入货车位数量!" }],
                smallCars: [{ required: true, message: "请输入小车位数量!" }],
                dangerousGoodsCarrier: [{ required: true, message: "请输入危化品车位数量!" }],
                livestockTruck: [{ required: true, message: "请输入牲畜车位数量!" }],
                electricCar: [{ required: true, message: "请输入充电停车位数量!" }],
                trailer: [{ required: true, message: "请输入拖挂车位数量!" }],
                limo: [{ required: true, message: "请输入房车位数量!" }],
                barrierFreeCar: [{ required: true, message: "请输入无障碍车位数量!" }],
                femaleCar: [{ required: true, message: "请输入女性车位数量!" }],
                reservedElectricCar: [{ required: true, message: "请输入预留充电停车位数量!" }],
            },
            toiletBean: {
                isToilet: [{ required: true, message: "请选择!" }],
                manUrinalNum: [{ required: true, message: "请输入男小便器数量!" }],
                manHoleNum: [{ required: true, message: "请输入男蹲位数量!" }],
                womanHoleNum: [{ required: true, message: "请输入女蹲位数量!" }],
                womanSeatThenNum: [{ required: true, message: "请输入女厕座便数量!" }],
                accessibleToiletNum: [{ required: true, message: "请输入无障碍卫生间数量!" }],
                thirdToiletNum: [{ required: true, message: "请输入第三卫生间数量!" }],
                thirdSeatNum: [{ required: true, message: "请输入第三卫生间便位数量!" }],
                mobileToiletSquatNum: [{ required: true, message: "请输入移动卫生间蹲位数量!" }],
                manSeatThenNum: [{ required: true, message: "请输入男厕座便数量!" }],
            },
            marketBean: {
                isSupermarket: [{ required: true, message: "请选择!" }],
                supermarketRunBusiness: [{ required: true, message: "请输入经营企业!" }],
                supermarketBusinessScope: [{ required: true, message: "请输入经营范围!" }],
                supermarketArea: [{ required: true, message: "请输入面积!" }],
                samePriceGoods: [{ required: true, message: "请输入实行同城同价商品!" }],
                localCharacteristicsGoods: [{ required: true, message: "请输入本地特色商品!" }],
                personInChargeMarket: [{ required: true, message: "请输入负责人!" }],
                telephoneMarket: [{ required: true, message: "请输入联系电话!" }],
            },
            foodBean: {
                isFoodBeverage: [{ required: true, message: "请选择是否有餐饮!" }],
                mealsKinds: [{ required: true, message: "请选择餐饮种类!" }],
                restaurantArea: [{ required: true, message: "请输入餐厅面积!" }],
                restaurantNum: [{ required: true, message: "请输入餐厅数量!" }],
                mainCuisine: [{ required: true, message: "请输入主菜系!" }],
                restaurantRoomNum: [{ required: true, message: "请输入包间数量!" }],
                mealsNum: [{ required: true, message: "请输入同时容纳就餐人数!" }],
                specialtyStore: [{ required: true, message: "请输入特色门店!" }],
            },
            roomBean: {
                isAccommodation: [{ required: true, message: "请选择!" }],
                guestRoomNum: [{ required: true, message: "请输入客房数!" }],
                standardRoomNum: [{ required: true, message: "请输入标准间数!" }],
                bedsNum: [{ required: true, message: "请输入床位数!" }],
            },
            showerBean: {
                isShower: [{ required: true, message: "请选择!" }],
                showerNum: [{ required: true, message: "请输入淋浴总数量!" }],
                manShowerNum: [{ required: true, message: "请输入男淋浴数量!" }],
                womanShowerNum: [{ required: true, message: "请输入女淋浴数量!" }],
            },
            waterBean: {
                isAddWater: [{ required: true, message: "请选择!" }],
                operateWater: [{ required: true, message: "请输入加水经营单位!" }],
                waterGunNum: [{ required: true, message: "请输入加水枪数量!" }],
                personInChargeWater: [{ required: true, message: "请输入负责人!" }],
                telephoneWater: [{ required: true, message: "请输入联系电话!" }],
            },
            garageBean: {
                isGarage: [{ required: true, message: "请选择!" }],
                isPracticeArea: [{ required: true, message: "请选择有无自修区" }],
                garageRunBusiness: [{ required: true, message: "请输入经营企业!" }],
                garageBusinessScope: [{ required: true, message: "请输入经营范围!" }],
                garageRoomNum: [{ required: true, message: "请输入维修车间数!" }],
                garageWorkerNum: [{ required: true, message: "请输入维修工人数!" }],
                personInChargeGarage: [{ required: true, message: "请输入负责人!" }],
                telephoneGarage: [{ required: true, message: "请输入联系电话!" }],
            },
            energyBean: {
              isChargingStation: [{ required: true, message: "请选择是否有充电站!" }],// 是否有充电站 0没有 1有
              chargeStationList:[{ // 充电站列表
                stationName: [{ required: true, message: "请输入充电站名称!" }],// 充电站名称
                longitude: [{ required: true, message: "请输入经度!" , trigger: "blur"}, {
                                pattern: /^(?:\d+|\d*\.\d{1,6})$/, 
                                message: "请输入经度小数点后6位",
                                trigger: "blur"
                            }],// 经度
                latitude: [{ required: true, message: "请输入纬度!" ,trigger: "blur"},{
                                pattern: /^(?:\d+|\d*\.\d{1,6})$/, 
                                message: "请输入经度小数点后6位",
                                trigger: "blur"
                            }],// 纬度
                transformerCapacity: [{ required: true, message: "请输入箱变容量（kVA）!" },{
                                      validator: (rule, value, callback) => {
                                        if (Number(value) <= 0) {
                                          callback(new Error("请输入箱变容量（kVA）必须大于0的数字"));
                                        } if(isNaN(Number(value))){
                                          callback(new Error("请输入箱变容量（kVA）必须大于0的数字"));
                                        }else {
                                          callback();
                                        }
                                      },
                                      trigger: "blur"
                                    }],// 箱变容量（kVA）
                ratedTotalPower: [{ required: true, message: "请输入额定总功率（kW）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入额定总功率（kW）大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 额定总功率（kW）
                isIntegratedStorage: [{ required: true, message: "请选择是否为充储一体化站!" }],// 是否为充储一体化站 0否 1是
                energyStorageCapacity: [{ required: true, message: "请输入储能配置规模（kWh）!" },{
                                    validator: (rule, value, callback) => {
                                       if (Number(value) <= 0) {
                                          callback(new Error("请输入储能配置规模（kWh）必须大于0的数字"));
                                        } if(isNaN(Number(value))){
                                          callback(new Error("请输入储能配置规模（kWh）必须大于0的数字"));
                                        }else {
                                          callback();
                                        }
                                    },
                                    trigger: "blur"
                                  }],// 储能配置规模（kWh）
                dischargeDuration: [{ required: true, message: "请输入放电时间（h）!" },{
                                    validator: (rule, value, callback) => {
                                       if (Number(value) <= 0) {
                                          callback(new Error("请输入放电时间（h）必须大于0的数字"));
                                        } if(isNaN(Number(value))){
                                          callback(new Error("请输入放电时间（h）必须大于0的数字"));
                                        }else {
                                          callback();
                                        }
                                    },
                                    trigger: "blur"
                                  }],// 放电时间（h）
                hasSolarPower: [{ required: true, message: "请选择是否有光伏供能!" }],// 是否有光伏供能 0否 1是
                solarPowerCapacity: [{ required: true, message: "请输入光伏配置规模（kWp）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入光伏配置规模（kWp）必须大于0的数字"));
                                      } if(isNaN(Number(value))){
                                        callback(new Error("请输入光伏配置规模（kWp）必须大于0的数字"));
                                      }else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 光伏配置规模（kWp）
                isV2gStation: [{ required: true, message: "请选择是否为V2G充电站!" }],// 是否为V2G充电站 0否 1是
                v2gStationType: [{ required: true, message: "请输入V2G充电站类型!" }],// V2G充电站类型
                v2gPileCount: [{ required: true, message: "请输入V2G充电桩数量!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入V2G充电桩数量大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// V2G充电桩数量
                v2gDischargePower: [{ required: true, message: "请输入V2G放电功率（kW）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入V2G放电功率（kW）大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// V2G放电功率（kW）
                cameraCount: [{ required: true, message: "请输入充电站摄像机数量!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入充电站摄像机数量大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 充电站摄像机数量
                hasCanopy: [{ required: true, message: "请选择是否有车棚!" }],// 是否有车棚 0否 1是
                stationStatus: [{ required: true, message: "请选择充电站状态!" }],// 充电站状态
                stationType: [{ required: true, message: "请选择充电站类型!" }],// 充电站类型
                parkingFeeType: [{ required: true, message: "请选择停车费类型!" }],// 停车费类型
                is24HoursOperation: [{ required: true, message: "请选择是否24小时开放!" }],// 是否24小时开放 0否 1是
                paymentMethods: [{ required: true, message: "请选择支付方式!" }],// 支付方式 多个逗号分隔
                stationPhone: [{ required: true, message: "请输入充电站电话!" }],// 充电站电话
                servicePhone: [{ required: true, message: "请输入服务电话!" }],// 服务电话
                constructionLocation: [{ required: true, message: "请选择建设场所!" }],// 建设场所
                surroundingEnvironment: [{ required: true, message: "请选择周边环境!" }],// 周边环境
                surroundingFacilities: [{ required: true, message: "请选择周边设施!" }],// 周边设施 多个逗号分隔
                builtTime: [{ required: true, message: "请选择建设时间!" }],// 建设时间
                commissioningTime: [{ required: true, message: "请选择启用时间!" }],// 启用时间
                stationPhotosList : [{ required: true, message: "请上传充电站照片（最多3张）!",trigger:['blur','change'] },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请上传充电站照片（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 充电站照片 多个逗号分隔
              }],
              chargePileList:[{ // 充电桩列表
                stationName: [{ required: true, message: "请选择充电桩所属充电站!" }],// 充电站名称
                chargerCount: [{ required: true, message: "请输入充电桩数量!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电桩数量
                deviceCode: [{ required: true, message: "请输入设备编码!" }],// 设备编码
                deviceType: [{ required: true, message: "请输入设备类型!" }],// 设备类型
                totalPower: [{ required: true, message: "请输入充电设备总功率（kW）!" },{
                                validator: (rule, value, callback) => {
                                 if (Number(value) <= 0) {
                                    callback(new Error("请输入充电设备总功率（kW）必须大于0的数字"));
                                  } if(isNaN(Number(value))){
                                    callback(new Error("请输入充电设备总功率（kW）必须大于0的数字"));
                                  }else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电设备总功率（kW）
                maxPower: [{ required: true, message: "请输入充电设备最大功率（kW）!" },{
                                validator: (rule, value, callback) => {
                                 if (Number(value) <= 0) {
                                    callback(new Error("请输入充电设备最大功率（kW）必须大于0的数字"));
                                  } if(isNaN(Number(value))){
                                    callback(new Error("请输入充电设备最大功率（kW）必须大于0的数字"));
                                  }else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电设备最大功率（kW）
                gunCount: [{ required: true, message: "请输入充电枪数量!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("请输入充电枪数量必须大于0的整数"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电枪数量
                voltageRange: [{ required: true, message: "请输入电压范围!" }],// 电压范围
                manufacturer: [{ required: true, message: "请输入生产厂家!" }],// 生产厂家
                maxCurrent: [{ required: true, message: "请输入充电设备最大电流（A）!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("请输入充电设备最大电流（A）必须大于0的数字"));
                                  } if(isNaN(Number(value))){
                                    callback(new Error("请输入充电设备最大电流（A）必须大于0的数字"));
                                  }else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电设备最大电流（A）
                builtTime: [{ required: true, message: "请选择建设时间!" }],// 建设时间
                operationTime: [{ required: true, message: "请选择运营时间!" }],// 运营时间
                gunImagesList: [{ required: true, message: "请上传充电桩充电枪数图照片（最多3张）!",trigger:['blur','change'] },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请上传充电桩充电枪数图照片（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 充电桩充电枪数图片（最多3张）
                nameplateImagesList: [{ required: true, message: "请上传充电桩铭牌图片（最多3张）!" },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请上传充电桩铭牌图片（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 充电桩铭牌图片（最多3张）
                inspectionReportImagesList: [{ required: true, message: "请上传第三方检测报告（最多3张）!" },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请上传第三方检测报告（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 第三方检测报告（最多3张）
                chargeGunList:[// 充电枪列表
                  { 
                    interfaceCode: [{ required: true, message: "请输入充电设备接口编码!" }],// 充电设备接口编码
                    isLinkedToCheck: [{ required: true, message: "请输入是否与第三方检测系统对接!" }],// 是否与第三方检测系统对接 0否 1是
                  }
                ]
              }]
            },
            babyBean: {
                isMotherBaby: [{ required: true, message: "请选择!" }],
                isMotherBabyRest: [{ required: true, message: "请选择!" }],
                isMotherBabyToilet: [{ required: true, message: "请选择!" }],
                motherBabyArea: [{ required: true, message: "请输入母婴室面积!" }],
                motherBabyNum: [{ required: true, message: "请输入母婴室数量!" }],
            },
            rescueBean: {
                isRescue: [{ required: true, message: "请选择!" }],
                isRescueApron: [{ required: true, message: "请选择!" }],
                isRescueBarrier: [{ required: true, message: "请选择!" }],
                isRescueCall: [{ required: true, message: "请选择!" }],
            },
            greenBean: {
                isGarbageClassify: [{ required: true, message: "请选择!" }],
                isGarbageHarmless: [{ required: true, message: "请选择!" }],
                isGarbageRecovery: [{ required: true, message: "请选择!" }],
                isGreenEnergy: [{ required: true, message: "请选择!" }],
                isSewageDetection: [{ required: true, message: "请选择!" }],
                isWaterReuse: [{ required: true, message: "请选择!" }],
                isWaterStandard: [{ required: true, message: "请选择!" }],
                dailyMaxCapacity: [{ required: true, message: "请选择污水处理设备日处理能力!" }],
                runningDate: [{ required: true, message: "请选择初始运营日期!" }],
                sewageMode: [{ required: true, message: "请输入污水处理模式!" }],
                dailyRealCapacity: [
                    { required: true, message: "请输入污水处理设备实际每日处理量!" },
                ],
                garbageNum: [{ required: true, message: "请输入垃圾收集容器配置数量!" }],
                greenEnergy: [{ required: true, message: "请输入绿色新能源!" }],
                garbageClassifyNum: [
                    { required: true, message: "请输入分类垃圾收集容器配置数量!" },
                ],
            },
            medicalBean: {
                isMedicalService: [{ required: true, message: "请选择!" }],
                isMedicalEmergency: [{ required: true, message: "请选择!" }],
                isMedicalStation: [{ required: true, message: "请选择/室）!" }],
                isNonPrescriptionDrugs: [{ required: true, message: "请选择!" }],
            },
            superviseBean: {
                isSupervise: [{ required: true, message: "请选择!" }],
                isComplaintDesk: [{ required: true, message: "请选择!" }],
                isSuperviseBoard: [{ required: true, message: "请选择!" }],
                isSuperviseTel: [{ required: true, message: "请选择!" }],
            },
            infoBean: {
              isInfoPublish: [{ required: true, message: "请选择是否有信息发布系统!" }], //  是否有信息发布系统 0否1是
              isServiceSatisfaction: [{ required: true, message: "请选择是否开展服务质量满意度检查!" }], // 是否开展服务质量满意度检查 0否1是
              isBroadcastSystem: [{ required: true, message: "请选择是否设有广播呼叫系统!" }], // 是否设有广播呼叫系统 0否1是
              isMultiMedia: [{ required: true, message: "请选择是否设置多媒体信息发布终端!" }],// 是否设置多媒体信息发布终端 0否1是
              isOnline: [{ required: true, message: "请选择是否通过互联网发布服务!" }],// 是否通过互联网发布服务 0否1是
              isInfoQuery: [{ required: true, message: "请选择是否设置信息查询设置!" }], // 是否设置信息查询设置 0否1是
              basServiceAreaInfoPublishList:[{
                equityUnit:[{ required: true, message: "请输入产权单位!" }],// 产权单位
                useUnit:[{ required: true, message: "请输入使用单位!" }],// 使用单位
                useClass:[{ required: true, message: "请选择使用分类!" }],// 使用分类
                equipmentClass:[{ required: true, message: "请选择设备分类!" }],// 设备分类
                displaySize:[{ required: true, message: "请输入显示尺寸!" }, {
                                pattern: /^\d+[x×]\d+$/, // 验证 数字x数字 的格式
                                message: "格式应为 10×5尺寸格式",
                                trigger: "blur"
                            }],// 显示尺寸
                displayArea:[{ required: true, message: "请输入显示面积!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("请输入显示面积必须大于0的数字"));
                                  } if(isNaN(Number(value))){
                                    callback(new Error("请输入显示面积必须大于0的数字"));
                                  }else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 显示屏面积（平方米）
                signalNetwork:[{ required: true, message: "请选择信号网络方式!" }],// 信号网络方式
                site:[{ required: true, message: "请选择位置!" }],// 位置
                equipmentProducer:[{ required: true, message: "请输入设备生产商!" }],// 设备生产商
                softwareControlSystem:[{ required: true, message: "请输入软件控制系统!" }],// 软件控制系统
                infoPublishControlSystem:[{ required: true, message: "请输入信息发布控制方式!" }],// 信息发布控制方式
                sceneManagePerson:[{ required: true, message: "请输入现场管理负责人及联系方式!" }],// 现场管理负责人及联系方式
                infoAuditPerson:[{ required: true, message: "请输入信息审核责任领导及联系方式!" }],// 信息审核责任领导及联系方式
                infoPublishPerson:[{ required: true, message: "请输入信息发布责任领导及联系方式!" }],// 信息发布责任领导及联系方式
              }]
            },
            monitorBean: {
                isMonitor: [{ required: true, message: "请选择!" }],
                cameraNum: [{ required: true, message: "请输入监控摄像头数量!" }],
                lowCameraNum: [{ required: true, message: "请输入普清监控摄像头数量!" }],
                highCameraNum: [{ required: true, message: "请输入高清监控摄像头数量!" }],
            },
            limoCampBean: {
                isLimoCamp: [{ required: true, message: "请选择!" }],
                isBasicService: [{ required: true, message: "请选择!" }],
                isOnlineBook: [{ required: true, message: "请选择!" }],
                isTelBook: [{ required: true, message: "请选择!" }],
                limoCampNum: [{ required: true, message: "请输入停靠房车营位!" }],
            },
            freeBean: {
                isFreeRest: [{ required: true, message: "请选择!" }],
                freeSeatNum: [{ required: true, message: "请输入免费休息区座位数!" }],
                isHotWater: [{ required: true, message: "请选择!" }],
                waterFaucetNum: [{ required: true, message: "请输入免费热水龙头数!" }],
            },
            fireBean: {
                isBunker: [{ required: true, message: "请选择!" }],
                isFire: [{ required: true, message: "请选择!" }],
                boothDesc: [
                    { required: true, message: "请输入经营摊位使用电、液化气、天然气情况!" },
                ],
                kitchenDesc: [
                    { required: true, message: "请输入厨房使用电、液化气、天然气情况!" },
                ],
            },
            etcBean: {
                isEtc: [{ required: true, message: "请选择!" }],
                etcCarType: [{ required: true, message: "请选择ETC车道通行车辆类型!" }],
                etcLaneNum: [{ required: true, message: "请输入ETC车道数量!" }],
                inLaneNum: [{ required: true, message: "请输入入口车道数量!" }],
                outLaneNum: [{ required: true, message: "请输入出口车道数量!" }],
            },
            electricityBean: {
              projectEntity: [{ required: true, message: "请输入项目法人!" }],
              constructionUnit: [{ required: true, message: "请输入建设单位" }],
              constructionState: [{ required: true, message: "请选择建设状态!" }],
              photoType: [{ required: true, message: "请选择类型!" }],
              photoScene: [{ required: true, message: "请选择光伏场景!" }],
              synchronizeMode: [{ required: true, message: "请选择并网模式!" }],
              totalPhotoCapacity: [{ required: true, message: "请输入光伏设备总容量（千瓦）" }],
              isEnergyDevice: [{ required: true, message: "请选择是否有储能设备!" }],
              totalEnergyCapacity: [{ required: true, message: "请输入储能设备总容量（千瓦时）!" }],
              annualAverageCapacity: [{ required: true, message: "请输入年均发电量（千瓦时）!" }],
              annualAverageHours: [
                { required: true, message: "请输入年均发电小时!"} ,{
                    validator: (rule, value, callback) => {
                      if (Number(value) <= 0) {
                        callback(new Error("请输入年均发电小时必须大于0的数字"));
                      } if(isNaN(Number(value))){
                        callback(new Error("请输入年均发电小时必须大于0的数字"));
                      }else {
                        callback();
                      }
                    },
                    trigger: "blur"
                  }
                ],
              annualAverageOnlineCapacity: [{ required: true, message: "请输入年均上网电量（千瓦时）" }],
              gridConnectionVoltageLevel: [{ required: true, message: "请输入并网电压等级!" }],
              note: [{ required: true, message: "请输入备注!" }],
            },
            driverHouseBean: {
              isHome: [{ required: true, message: "请选择是否建设货车'司机之家'!" }],
              distance: [{ required: true, message: "请输入距离重庆主城距离（KM）" },{
                validator: (rule, value, callback) => {
                    if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
                      callback(new Error("请输入距离重庆主城距离（KM）必须大于0且最多两位小数"));
                    } else {
                        callback();
                    }
                },
              }],
              homeArea: [{ required: true, message: "请输入司机之家房屋面积（m2）!" },{
                validator: (rule, value, callback) => {
                    if (!/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value)) {
                      callback(new Error("请输入司机之家房屋面积（m2）必须大于0且最多两位小数"));
                    } else {
                        callback();
                    }
                },
              }],
              totalNum: [{ required: true, message: "请输入能同时容纳的人数!" }],
              annualPersonNum: [{ required: true, message: "请输入年人均使用人数!" }],
              serviceFunction: [{ required: true, message: "请选择'司机之家'服务功能!" }],
              isStandardDesign: [{ required: true, message: "请选择是否按照标准设计打造" }],
              isPass: [{ required: true, message: "请选择是否通过验收!" }],
              constructedUnit: [{ required: true, message: "请输入投建单位!" }],
              constructedCost: [{ required: true, message: "请输入投资建设费用!" }],
              manageUnit: [{ required: true, message: "请输入管理单位!" }],
              sitePrincipal: [{ required: true, message: "请输入现场负责人" }],
              sitePrincipalTel: [{ required: true, message: "请输入现场负责人联系电话!" }],
              buildTime: [{ required: true, message: "请选择建成时间!" }],
              isStation: [{ required: true, message: "请选择是否为同心驿站!" }],
            },
        },
        navigationList: [
            //基本信息树
            { name: "basicBean", number: 0, total: 0, text: "服务区基本信息" },
            { name: "personBean", number: 0, total: 0, text: "服务区工作人员" },
            { name: "officeBean", number: 0, total: 0, text: "经营管理单位办公用房" },
            { name: "areaBean", number: 0, total: 0, text: "服务区场所面积" },
            { name: "carBean", number: 0, total: 0, text: "停车位数" },
            { name: "toiletBean", number: 0, total: 0, text: "公共卫生间" },
            { name: "marketBean", number: 0, total: 0, text: "商超" },
            { name: "foodBean", number: 0, total: 0, text: "餐饮" },
            { name: "roomBean", number: 0, total: 0, text: "客房" },
            { name: "showerBean", number: 0, total: 0, text: "淋浴" },
            { name: "waterBean", number: 0, total: 0, text: "加水" },
            { name: "garageBean", number: 0, total: 0, text: "汽修" },
            { name: "energyBean", number: 0, total: 0, text: "车辆能源补给" },
            { name: "babyBean", number: 0, total: 0, text: "母婴室" },
            { name: "rescueBean", number: 0, total: 0, text: "应急救援服务" },
            { name: "greenBean", number: 0, total: 0, text: "节能减排绿色" },
            { name: "medicalBean", number: 0, total: 0, text: "医疗卫生服务" },
            { name: "superviseBean", number: 0, total: 0, text: "服务质量管理监督" },
            { name: "infoBean", number: 0, total: 0, text: "信息发布" },
            { name: "monitorBean", number: 0, total: 0, text: "服务区安防监控" },
            { name: "limoCampBean", number: 0, total: 0, text: "房车营地" },
            { name: "freeBean", number: 0, total: 0, text: "免费休息区" },
            { name: "fireBean", number: 0, total: 0, text: "安全" },
            { name: "etcBean", number: 0, total: 0, text: "ETC车道" },
            { name: "electricityBean", number: 0, total: 0, text: "光伏发电" },
            { name: "driverHouseBean", number: 0, total: 0, text: "司机之家" },
        ],
        companyList: [],
        orgList: [],
        dictItemsList: [],
        planeFigure: {},
        roadList: [],
        roadLineList: [],
        upLoadImg: "",
        drawerStatus: false,
        companyManagerList: [],
        procInsId: "",
        taskId: "",
        commitStatus: false,
        auditHistoryVisible: false,
        auditHistoryData: [],
        historyLoading: false,
    }),
    getters: {

        getDrawerStatus() {
            return this.drawerStatus;
        },
        /**
         * 获取审核状态
         * @returns {string} 审核状态值
         */
        getAuditStatus() {
            return this.formInfo.auditStatus;
        },
    },
    actions: {
        /**
         * @description 设置公司
         */
        setFormInfoCompany(val) {
            this.formInfo.basicBean.manageCompany = val;
        },

        /**
         * @description 设置图片
         */
        setUpLoadImg(value) {
            this.upLoadImg = value;
        },
       
        /**
         * @description 删除/置空图片
         */
        setImgBlank(value) {
            this.formInfo.basicBean.files = "";
        },
        /**
         * @description 关闭抽屉
         */
        deawerClose() {
            this.flag = "";
            this.drawerStatus = false;
        },

        /**
         * @description 新增服务区信息
         */
        addAreaInfo() {
            this.flag = "add";
            this.formInfoDisabled = false;
            this.drawerStatus = true;
            this.planeFigure = {};
            this.formInfo = {
                basicBean: {
                    name: null,
                    code: null,
                    type: null,
                    longitude: null,
                    latitude: null,
                    brief: null,
                    province: null,
                    city: null,
                    county: null,
                    layoutForm: null,
                    serviceMode: null,
                    serviceAreaDirection: null,
                    directionName: null,
                    highSpeed: null,
                    highCode: null,
                    company: null,
                    auditUserId: null,
                    startTollStation: null,
                    endTollStation: null,
                    road: null,
                    roadType: null,
                    locationPileNo: null,
                    operationTime: null,
                    builtTime: null,
                    star: null,
                    ownership: null,
                    businessUnits: null,
                    unitNature: null,
                    isWholeYear: null,
                    isWholeDay: null,
                    isOpenService:0,
                    isSpecService:0,
                    isVehicleCount: null,
                    isVehicleAuto: null,
                    isFarmerMode: null,
                    farmerMode: null,
                    isTruckHome: null,
                    truckHome: null,
                    isTwoWay: null,
                    isTheme: null,
                    area: null,
                    consultationTel: null,
                    remark: null,
                    status: null,
                    abnormalReason: null,
                    isShow: null,
                    side: null,
                    files: null,
                    manageCompany: null,
                },
                areaBean: {
                    totalRoomNum: null,
                    totalArea: null,
                    coversArea: null,
                    buildArea: null,
                    greenArea: null,
                    parkingLotArea: null,
                    staffDormitoryArea: null,
                    maintenanceArea: null,
                    gasArea: null,
                    petrolArea: null,
                    chargingArea: null,
                    parkingTruckArea: null,
                    parkingPassengerArea: null,
                    marketArea: null,
                    cateringArea: null,
                    warehousingArea: null,
                    guestArea: null,
                    freeArea: null,
                },
                babyBean: {
                    isMotherBaby: null,
                    motherBabyNum: null,
                    motherBabyArea: null,
                    isMotherBabyToilet: null,
                    isMotherBabyRest: null,
                },
                carBean: {
                    isParking: null,
                    isPassengerStop: null,
                    largeTruck: null,
                    buses: null,
                    smallCars: null,
                    dangerousGoodsCarrier: null,
                    livestockTruck: null,
                    electricCar: null,
                    trailer: null,
                    limo: null,
                    reservedElectricCar: null,
                    femaleCar: null,
                    barrierFreeCar: null,
                },
                energyBean: {
                  isChargingStation: '1',// 是否有充电站 0没有 1有
                  chargeStationList:[{ // 充电站列表
                    stationId: null,// 充电站ID
                    stationName: null,// 充电站名称
                    stationAddress: null,// 充电站地址
                    longitude: null,// 经度
                    latitude: null,// 纬度
                    transformerCapacity: null,// 箱变容量（kVA）
                    ratedTotalPower: null,// 额定总功率（kW）
                    isIntegratedStorage: '0',// 是否为充储一体化站 0否 1是
                    energyStorageCapacity: null,// 储能配置规模（kWh）
                    dischargeDuration: null,// 放电时间（h）
                    hasSolarPower: '0',// 是否有光伏供能 0否 1是
                    solarPowerCapacity: null,// 光伏配置规模（kWp）
                    isV2gStation: '0',// 是否为V2G充电站 0否 1是
                    v2gStationType: null,// V2G充电站类型
                    v2gPileCount: null,// V2G充电桩数量
                    v2gDischargePower: null,// V2G放电功率（kW）
                    cameraCount: null,// 充电站摄像机数量
                    hasCanopy: "1",// 是否有车棚 0否 1是
                    stationStatus: null,// 充电站状态
                    stationType: null,// 充电站类型
                    parkingFeeType: null,// 停车费类型
                    is24HoursOperation: "1",// 是否24小时开放 0否 1是
                    paymentMethods: [],// 支付方式 多个逗号分隔
                    stationPhone: null,// 充电站电话
                    servicePhone: null,// 服务电话
                    constructionLocation: null,// 建设场所
                    surroundingEnvironment: null,// 周边环境
                    surroundingFacilities: [],// 周边设施 多个逗号分隔
                    builtTime: null,// 建设时间
                    commissioningTime: null,// 启用时间
                    stationPhotosList : [],// 充电站照片 多个逗号分隔
                  }],
                  chargePileList:[{ // 充电桩列表
                    serviceAreaId: null,// 服务区域ID
                    stationName: null,// 充电站名称
                    chargerCount: null,// 充电桩数量
                    deviceCode: null,// 设备编码
                    deviceName: null,// 设备名称
                    deviceType: null,// 设备类型
                    totalPower: null,// 充电设备总功率（kW）
                    maxPower: null,// 充电设备最大功率（kW）
                    gunCount: null,// 充电枪数量
                    voltageRange: null,// 电压范围
                    manufacturer: null,// 生产厂家
                    maxCurrent: null,// 充电设备最大电流（A）
                    builtTime: null,// 建设时间
                    operationTime: null,// 运营时间
                    gunImagesList: [],// 充电桩充电枪数图片（最多3张）
                    nameplateImagesList: [],// 充电桩铭牌图片（最多3张）
                    inspectionReportImagesList: [],// 第三方检测报告（最多3张）
                    chargeGunList:[// 充电枪列表
                      { 
                        interfaceCode: null,// 充电设备接口编码
                        interfaceName: null,// 充电设备接口名称
                        isLinkedToCheck: null,// 是否与第三方检测系统对接 0否 1是
                      }
                    ]
                  }]
              },
                etcBean: {
                    isEtc: null,
                    etcLaneNum: null,
                    etcCarType: null,
                    inLaneNum: null,
                    outLaneNum: null,
                },
                fireBean: {
                    isFire: null,
                    isBunker: null,
                    kitchenDesc: null,
                    boothDesc: null,
                },
                foodBean: {
                    isFoodBeverage: null,
                    restaurantArea: null,
                    restaurantNum: null,
                    mainCuisine: null,
                    restaurantRoomNum: null,
                    mealsNum: null,
                    specialtyStore: null,
                    mealsKinds: null,
                },
                freeBean: {
                    isFreeRest: null,
                    isHotWater: null,
                    freeSeatNum: null,
                    waterFaucetNum: null,
                },
                garageBean: {
                    isGarage: null,
                    garageRunBusiness: null,
                    garageBusinessScope: null,
                    isPracticeArea: null,
                    garageRoomNum: null,
                    garageWorkerNum: null,
                    personInChargeGarage: null,
                    telephoneGarage: null,
                },
                greenBean: {
                    sewageMode: null,
                    runningDate: null,
                    dailyMaxCapacity: null,
                    dailyRealCapacity: null,
                    garbageNum: null,
                    garbageClassifyNum: null,
                    isWaterStandard: null,
                    isSewageDetection: null,
                    isGarbageClassify: null,
                    isGarbageHarmless: null,
                    isWaterReuse: null,
                    isGarbageRecovery: null,
                    isGreenEnergy: null,
                    greenEnergy: null,
                },
                infoBean: {
                  isInfoPublish: '1', //  是否有信息发布系统 0否1是
                  isServiceSatisfaction: '1', // 是否开展服务质量满意度检查 0否1是
                  isBroadcastSystem: '1', // 是否设有广播呼叫系统 0否1是
                  isMultiMedia: '1',// 是否设置多媒体信息发布终端 0否1是
                  isOnline: '1',// 是否通过互联网发布服务 0否1是
                  isInfoQuery: '1', // 是否设置信息查询设置 0否1是
                  basServiceAreaInfoPublishList:[{
                    equipmentNum:null, // 设备编号
                    equityUnit:null,// 产权单位
                    useUnit:null,// 使用单位
                    useClass:null,// 使用分类
                    equipmentClass:null,// 设备分类
                    displaySize:null,// 显示尺寸
                    displayArea:null,// 显示屏面积（平方米）
                    signalNetwork:null,// 信号网络方式
                    site:null,// 位置
                    equipmentProducer:null,// 设备生产商
                    softwareControlSystem:null,// 软件控制系统
                    infoPublishControlSystem:null,// 信息发布控制方式
                    sceneManagePerson:null,// 现场管理负责人及联系方式
                    infoAuditPerson:null,// 信息审核责任领导及联系方式
                    infoPublishPerson:null,// 信息发布责任领导及联系方式
                  }]
                },
                limoCampBean: {
                    isLimoCamp: null,
                    limoCampNum: null,
                    isBasicService: null,
                    isTelBook: null,
                    isOnlineBook: null,
                },
                marketBean: {
                    isSupermarket: null,
                    supermarketRunBusiness: null,
                    supermarketBusinessScope: null,
                    supermarketArea: null,
                    samePriceGoods: null,
                    localCharacteristicsGoods: null,
                    personInChargeMarket: null,
                    telephoneMarket: null,
                },
                medicalBean: {
                    isMedicalService: null,
                    isMedicalStation: null,
                    isMedicalEmergency: null,
                    isNonPrescriptionDrugs: null,
                },
                monitorBean: {
                    isMonitor: null,
                    cameraNum: null,
                    highCameraNum: null,
                    lowCameraNum: null,
                },
                officeBean: {
                    officeArea: null,
                    officeRoomNum: null,
                },
                personBean: {
                    managePersonNum: null,
                    assistNum: null,
                    securityGuardNum: null,
                    procterGambleNum: null,
                    cateringStaffNum: null,
                    salesmanNum: null,
                    electricianNum: null,
                    gasStationPerson: null,
                    ableAccommodationNum: null,
                    ownerManageNum: null,
                    operateManageNum: null,
                    operateServiceNum: null,
                    informationNum: null,
                    guaranteeNum: null,
                },
                rescueBean: {
                    isRescue: null,
                    isRescueBarrier: null,
                    isRescueCall: null,
                    isRescueApron: null,
                },
                roomBean: {
                    isAccommodation: null,
                    guestRoomNum: null,
                    standardRoomNum: null,
                    bedsNum: null,
                },
                showerBean: {
                    isShower: null,
                    showerNum: null,
                    manShowerNum: null,
                    womanShowerNum: null,
                },
                superviseBean: {
                    isSupervise: null,
                    isSuperviseBoard: null,
                    isSuperviseTel: null,
                    isComplaintDesk: null,
                },
                toiletBean: {
                    isToilet: null,
                    manUrinalNum: null,
                    manHoleNum: null,
                    manSeatThenNum: null,
                    womanHoleNum: null,
                    womanSeatThenNum: null,
                    accessibleToiletNum: null,
                    thirdToiletNum: null,
                    thirdSeatNum: null,
                    mobileToiletSquatNum: null,
                },
                waterBean: {
                    isAddWater: null,
                    waterGunNum: null,
                    operateWater: null,
                    personInChargeWater: null,
                    telephoneWater: null,
                },
                electricityBean:{
                  projectEntity:null, // 项目法人
                  constructionUnit:null, // 建设单位
                  constructionState:null, // 建设状态
                  photoType:null, // 类型  独立光伏 0/分布式光伏 1
                  photoScene:null, // 光伏场景
                  synchronizeMode:[], // 并网模式 自发自用0；自发自用1，余电上网2；全额上网3
                  isEnergyDevice:null, // 是否有储能设备
                  totalPhotoCapacity:null, // 光伏设备总容量（千瓦）
                  totalEnergyCapacity:null, // 储能设备总容量（千瓦）
                  annualAverageCapacity :null, // 年平均容量（千瓦）
                  annualAverageHours :null, // 年均发电小时
                  annualAverageOnlineCapacity :null, // 年均上网电量（千瓦时）
                  actualTime :null, // 建成投用时间
                  gridConnectionTime :null, // 并网时间
                  gridConnectionVoltageLevel :null, // 并网电压等级
                  note :null, // 备注
                },
                driverHouseBean:{
                  isHome:'0', // 是否建设货车“司机之家 0否1是
                  distance:null, // 距离重庆主城距离（KM）
                  homeArea:null, // 司机之家房屋面积（m2）
                  totalNum:null, // 能同时容纳人数
                  annualPersonNum:null, // 年人均使用人数
                  serviceFunction:[], // 司机之家”服务功能
                  description:null, // 简要说明
                  descriptionImageList:[], // 简要说明图片
                  isStandardDesign:null, // 是否按照标准设计打造 0否1是
                  isPass:null, // 是否通过验收 0否1是
                  constructedUnit:null, // 投建单位
                  constructedCost:null, // 投资建设费用
                  manageUnit:null, // 管理单位
                  sitePrincipal:null, // 现场负责人
                  sitePrincipalTel:null, // 现场负责人电话
                  buildTime:null, // 建成时间
                  isStation:"0", // 是否为同心驿站 0否1是
                  specialService:null, // 特色服务
                  specialServiceImageList:[] // 特色服务图片
                }
            };
            this.dealnavigaSource(this.formInfo, 0);
        },

        /**
         * @description 代办获取区域信息
         */
        todoAreaInfo(e) {
            this.flag = "todo";
            this.commitStatus = false;
            if (this.formInfo.auditStatus == 2 || this.formInfo.auditStatus == 3) {
                this.formInfoDisabled = false;
            } else {
                this.formInfoDisabled = true;
            }
            console.log(this.formInfo.auditStatus, 'this.formInfo.auditStatus')
            if (e.$route.query && e.$route.query.formKey) {
                let queryData = e.$route.query;
                let jumpIdArr = queryData.formKey.split("=");
                let jumpIdStr = jumpIdArr[1];
                let data = {
                    id: jumpIdStr,
                    procInstId: e.$route.query.procInsId,
                    taskId: e.$route.query.taskId,
                };
                this.procInstId = e.$route.query.procInsId;
                this.taskId = e.$route.query.taskId;
                this.getAreaInfo(data);
            }
        },
        /**
         * @description 查看审核历史纪录
         */
        getAuditHistory() {
            this.historyLoading = true;
            getServiceArealnfoList({
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                procInstId: this.procInstId,
            })
                .then((e) => {
                    if (e.code === 200) {
                        this.auditHistoryVisible = true;
                        let historyList = e.data.historyProcNodeList
                        historyList.map((item) => {
                            item.fullMessage = item.commentList[0].fullMessage
                        })
                        this.auditHistoryData = historyList;
                        this.historyLoading = false;
                    }
                })
                .catch((error) => {
                    console.log(error, "error");
                    ElMessage.error(error);
                });
        },

        /**
         * @description 获取区域信息
         */
        editAreaInfo(e) {
            this.flag = "edit";
            this.formInfoDisabled = false;
            this.getAreaInfo(e);
        },

        /**
         * @description 获取区域信息
         */
        detailAreaInfo(e) {
            this.flag = "detail";
            this.formInfoDisabled = true;
            this.getAreaInfo(e);
        },

        /**
         * @description 计算预留充电桩
         */
        computeReservedElectricCar() {
            if (
                this.formInfo.carBean.smallCars == "" ||
                !this.formInfo.carBean.smallCars ||
                this.formInfo.carBean.femaleCar == "" ||
                !this.formInfo.carBean.femaleCar ||
                this.formInfo.carBean.barrierFreeCar == "" ||
                !this.formInfo.carBean.barrierFreeCar ||
                this.formInfo.carBean.electricCar == "" ||
                this.formInfo.carBean.barrierFreeCar == "" ||
                !this.formInfo.carBean.barrierFreeCar ||
                this.formInfo.carBean.electricCar == "" ||
                !this.formInfo.carBean.electricCar
            ) {
                this.formInfo.carBean.reservedElectricCar = null;
                return;
            }
            let reservedElectricCar =
                (parseInt(this.formInfo.carBean.smallCars) +
                    parseInt(this.formInfo.carBean.femaleCar) +
                    parseInt(this.formInfo.carBean.barrierFreeCar) +
                    parseInt(this.formInfo.carBean.electricCar)) *
                0.1;
            reservedElectricCar = reservedElectricCar - this.formInfo.carBean.electricCar;
            if (reservedElectricCar < 0) {
                this.formInfo.carBean.reservedElectricCar = 0;
            } else {
                this.formInfo.carBean.reservedElectricCar = Math.ceil(reservedElectricCar);
            }
        },

        /**
         *@description  navigationList  total  number 处理
         */
        dealnavigaSource(list, numner) {
            for (let key in list) {
                if (list.hasOwnProperty(key)) {
                    if (Object.prototype.toString.call(list[key]) === "[object Object]") {
                        let entrObj = Object.keys(list[key]).filter((val) => list[key][val] != null)
                        this.navigationList.map((e) => {
                            if (key === e.name) {
                                e.total = Object.keys(list[key]).length;
                                e.number = numner != null ? numner : Object.keys(entrObj).length;
                            }
                        });
                    }
                }
            }
        },

        /**
         * @description 获取详细信息
         */
        getAreaInfo(obj) {
            const loading = ElLoading.service({
                fullscreen: true,
                lock: true,
                text: "获取数据中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            loading;
            getServiceAreaInfo(obj)
                .then((res) => {
                    if (res.code === 200) {
                        loading.close();
                        let serviceAreaInfo = res.data,
                            manageOrgStr = serviceAreaInfo.basicBean.manageCompany,
                            manageOrgArr = [];
                        // 图片回显
                        serviceAreaInfo.basicBean.files == null ? this.planeFigure = {} : this.planeFigure = { url: process.env.VUE_APP_API_HOST_URL + process.env.VUE_APP_API_BASE_URL + `/pub/common/file/download?service=basServiceAreaInfoFileServiceImpl&id=${serviceAreaInfo.basicBean.files.split(",")[0]}` };
                        // 服务区基本信息 - 管理公司回显
                        if (manageOrgStr != null && manageOrgStr.includes(",")) {
                            manageOrgArr = manageOrgStr.split(",");
                            manageOrgArr = manageOrgArr.filter((item) => item != null && item != "");
                        } else if (manageOrgStr != null) {
                            manageOrgArr.push(manageOrgStr);
                        }
                        serviceAreaInfo.basicBean.manageCompany = manageOrgArr;
                        //审核状态
                        serviceAreaInfo.auditStatus = String(serviceAreaInfo.auditStatus);
                        //所属公司：
                        serviceAreaInfo.basicBean.company = String(serviceAreaInfo.basicBean.company);
                        //状态
                        serviceAreaInfo.basicBean.status = String(serviceAreaInfo.basicBean.status);
                        serviceAreaInfo.greenBean.sewageMode = String(serviceAreaInfo.greenBean.sewageMode);
                        // 待审核状态 默认审核通过
                        if (!serviceAreaInfo.isStatus) {
                            serviceAreaInfo.isStatus = 0;
                        }
                        this.formInfo = serviceAreaInfo;
                        // 处理后端返回的特殊几个字段是未null或布尔类型转为字符串类型
                        this.formInfo.energyBean.isChargingStation = (serviceAreaInfo.energyBean.isChargingStation ?? '0').toString();
                        this.formInfo.driverHouseBean.isHome = (serviceAreaInfo.driverHouseBean.isHome?? '0').toString();
                        this.formInfo.infoBean.isInfoPublish = (serviceAreaInfo.infoBean.isInfoPublish ?? '0').toString();
                        // 充电站接口返回空数组默认新增一条充电站数据到集合
                        this.formInfo.energyBean.chargeStationList.length===0 && this.initNewChargingStation();
                        // 充电桩接口返回空数组默认新增一条充电桩数据到集合
                        this.formInfo.energyBean.chargePileList.length===0 && this.initNewChargingPiles();
                        this.bindData(serviceAreaInfo);
                        this.drawerStatus = true;
                    } else {
                        loading.close();
                        ElMessage.warning(res.message);
                    }
                })
                .catch((error) => {
                    console.log(error, "error");
                    loading.close();
                    ElMessage.error(error);
                });
        },

        /**
         * @description 数据强绑定绑定 避免过度循环造成性能问题
         */
        bindData(e) {
          const dealFormInfo = {
              basicBean: {
                  name: e.basicBean.name,
                  code: e.basicBean.code,
                  type: e.basicBean.type,
                  longitude: e.basicBean.longitude,
                  latitude: e.basicBean.latitude,
                  brief: e.basicBean.brief,
                  province: e.basicBean.province,
                  city: e.basicBean.city,
                  county: e.basicBean.county,
                  layoutForm: e.basicBean.layoutForm,
                  serviceMode: e.basicBean.serviceMode,
                  serviceAreaDirection: e.basicBean.serviceAreaDirection,
                  directionName: e.basicBean.directionName,
                  highSpeed: e.basicBean.highSpeed,
                  highCode: e.basicBean.highCode,
                  company: e.basicBean.company,
                  auditUserId: e.basicBean.auditUserId,
                  startTollStation: e.basicBean.startTollStation,
                  endTollStation: e.basicBean.endTollStation,
                  road: e.basicBean.road,
                  roadType: e.basicBean.roadType,
                  locationPileNo: e.basicBean.locationPileNo,
                  operationTime: e.basicBean.operationTime,
                  builtTime: e.basicBean.builtTime,
                  star: e.basicBean.star,
                  ownership: e.basicBean.ownership,
                  businessUnits: e.basicBean.businessUnits,
                  unitNature: e.basicBean.unitNature,
                  isWholeYear: e.basicBean.isWholeYear,
                  isWholeDay: e.basicBean.isWholeDay,
                  isOpenService:e.basicBean.isOpenService,
                  isSpecService:e.basicBean.isSpecService,
                  isVehicleCount: e.basicBean.isVehicleCount,
                  isVehicleAuto: e.basicBean.isVehicleAuto,
                  isFarmerMode: e.basicBean.isFarmerMode,
                  farmerMode: e.basicBean.farmerMode,
                  isTruckHome: e.basicBean.isTruckHome,
                  truckHome: e.basicBean.isTruckHome,
                  isTwoWay: e.basicBean.isTwoWay,
                  isTheme: e.basicBean.isTheme,
                  area: e.basicBean.area,
                  consultationTel: e.basicBean.consultationTel,
                  remark: e.basicBean.remark,
                  status: e.basicBean.status,
                  abnormalReason: e.basicBean.abnormalReason,
                  isShow: e.basicBean.isShow,
                  side: e.basicBean.side,
                  files: e.basicBean.files,
                  manageCompany: e.basicBean.manageCompany,
              },
              areaBean: {
                  totalRoomNum: e.areaBean.totalRoomNum,
                  totalArea: e.areaBean.totalArea,
                  coversArea: e.areaBean.coversArea,
                  buildArea: e.areaBean.buildArea,
                  greenArea: e.areaBean.greenArea,
                  parkingLotArea: e.areaBean.parkingLotArea,
                  staffDormitoryArea: e.areaBean.staffDormitoryArea,
                  maintenanceArea: e.areaBean.maintenanceArea,
                  gasArea: e.areaBean.gasArea,
                  petrolArea: e.areaBean.petrolArea,
                  chargingArea: e.areaBean.chargingArea,
                  parkingTruckArea: e.areaBean.parkingTruckArea,
                  parkingPassengerArea: e.areaBean.parkingPassengerArea,
                  marketArea: e.areaBean.marketArea,
                  cateringArea: e.areaBean.marketArea,
                  warehousingArea: e.areaBean.warehousingArea,
                  guestArea: e.areaBean.marketArea,
                  freeArea: e.areaBean.freeArea,
              },
              babyBean: {
                  isMotherBaby: e.babyBean.isMotherBaby,
                  motherBabyNum: e.babyBean.motherBabyNum,
                  motherBabyArea: e.babyBean.motherBabyArea,
                  isMotherBabyToilet: e.babyBean.isMotherBabyToilet,
                  isMotherBabyRest: e.babyBean.isMotherBabyRest,
              },
              carBean: {
                  isParking: e.carBean.isParking,
                  isPassengerStop: e.carBean.isPassengerStop,
                  largeTruck: e.carBean.largeTruck,
                  buses: e.carBean.buses,
                  smallCars: e.carBean.smallCars,
                  dangerousGoodsCarrier: e.carBean.dangerousGoodsCarrier,
                  livestockTruck: e.carBean.livestockTruck,
                  electricCar: e.carBean.electricCar,
                  trailer: e.carBean.trailer,
                  limo: e.carBean.limo,
                  reservedElectricCar: e.carBean.reservedElectricCar,
                  femaleCar: e.carBean.femaleCar,
                  barrierFreeCar: e.carBean.barrierFreeCar,
              },
              energyBean: {
                  isChargingStation: e.energyBean.isChargingStation,// 是否有充电站 0没有 1有
                  chargeStationList: 
                  e.energyBean.chargeStationList.length ===0 ?[{ // 充电站列表
                    stationId: null,// 充电站ID
                    stationName: null,// 充电站名称
                    stationAddress: null,// 充电站地址
                    longitude: null,// 经度
                    latitude: null,// 纬度
                    transformerCapacity: null,// 箱变容量（kVA）
                    ratedTotalPower: null,// 额定总功率（kW）
                    isIntegratedStorage: '0',// 是否为充储一体化站 0否 1是
                    energyStorageCapacity: null,// 储能配置规模（kWh）
                    dischargeDuration: null,// 放电时间（h）
                    hasSolarPower: '0',// 是否有光伏供能 0否 1是
                    solarPowerCapacity: null,// 光伏配置规模（kWp）
                    isV2gStation: '0',// 是否为V2G充电站 0否 1是
                    v2gStationType: null,// V2G充电站类型
                    v2gPileCount: null,// V2G充电桩数量
                    v2gDischargePower: null,// V2G放电功率（kW）
                    cameraCount: null,// 充电站摄像机数量
                    hasCanopy: "1",// 是否有车棚 0否 1是
                    stationStatus: null,// 充电站状态
                    stationType: null,// 充电站类型
                    parkingFeeType: null,// 停车费类型
                    is24HoursOperation: '1',// 是否24小时开放 0否 1是
                    paymentMethods: [],// 支付方式 多个逗号分隔
                    stationPhone: null,// 充电站电话
                    servicePhone: null,// 服务电话
                    constructionLocation: null,// 建设场所
                    surroundingEnvironment: null,// 周边环境
                    surroundingFacilities: [],// 周边设施 多个逗号分隔
                    builtTime: null,// 建设时间
                    commissioningTime: null,// 启用时间
                    stationPhotosList : [],// 充电站照片 多个逗号分隔
                  }]:e.energyBean.chargeStationList ,// 充电站信息
                  chargePileList:e.energyBean.chargePileList.length === 0 ? [{ // 充电桩列表
                    serviceAreaId: null,// 服务区域ID
                    stationName: null,// 充电站名称
                    chargerCount: null,// 充电桩数量
                    deviceCode: null,// 设备编码
                    deviceName: null,// 设备名称
                    deviceType: null,// 设备类型
                    totalPower: null,// 充电设备总功率（kW）
                    maxPower: null,// 充电设备最大功率（kW）
                    gunCount: null,// 充电枪数量
                    voltageRange: null,// 电压范围
                    manufacturer: null,// 生产厂家
                    maxCurrent: null,// 充电设备最大电流（A）
                    builtTime: null,// 建设时间
                    operationTime: null,// 运营时间
                    gunImagesList: [],// 充电桩充电枪数图片（最多3张）
                    nameplateImagesList: [],// 充电桩铭牌图片（最多3张）
                    inspectionReportImagesList: [],// 第三方检测报告（最多3张）
                    chargeGunList:[// 充电枪列表
                      { 
                        interfaceCode: null,// 充电设备接口编码
                        interfaceName: null,// 充电设备接口名称
                        isLinkedToCheck: null,// 是否与第三方检测系统对接 0否 1是
                      }
                    ]
                }]:e.energyBean.chargePileList,// 充电桩信息 
              },
              etcBean: {
                  isEtc: e.etcBean.isEtc,
                  etcLaneNum: e.etcBean.etcLaneNum,
                  etcCarType: e.etcBean.etcCarType,
                  inLaneNum: e.etcBean.inLaneNum,
                  outLaneNum: e.etcBean.outLaneNum,
              },
              fireBean: {
                  isFire: e.fireBean.isFire,
                  isBunker: e.fireBean.isBunker,
                  kitchenDesc: e.fireBean.kitchenDesc,
                  boothDesc: e.fireBean.boothDesc,
              },
              foodBean: {
                  isFoodBeverage: e.foodBean.isFoodBeverage,
                  restaurantArea: e.foodBean.restaurantArea,
                  restaurantNum: e.foodBean.restaurantNum,
                  mainCuisine: e.foodBean.mainCuisine,
                  restaurantRoomNum: e.foodBean.restaurantRoomNum,
                  mealsNum: e.foodBean.mealsNum,
                  specialtyStore: e.foodBean.specialtyStore,
                  mealsKinds: e.foodBean.mealsKinds,
              },
              freeBean: {
                  isFreeRest: e.freeBean.isFreeRest,
                  isHotWater: e.freeBean.isHotWater,
                  freeSeatNum: e.freeBean.freeSeatNum,
                  waterFaucetNum: e.freeBean.waterFaucetNum,
              },
              garageBean: {
                  isGarage: e.garageBean.isGarage,
                  garageRunBusiness: e.garageBean.garageRunBusiness,
                  garageBusinessScope: e.garageBean.garageBusinessScope,
                  isPracticeArea: e.garageBean.isPracticeArea,
                  garageRoomNum: e.garageBean.garageRoomNum,
                  garageWorkerNum: e.garageBean.garageWorkerNum,
                  personInChargeGarage: e.garageBean.personInChargeGarage,
                  telephoneGarage: e.garageBean.telephoneGarage,
              },
              greenBean: {
                  sewageMode: e.greenBean.sewageMode,
                  runningDate: e.greenBean.runningDate,
                  dailyMaxCapacity: e.greenBean.dailyMaxCapacity,
                  dailyRealCapacity: e.greenBean.dailyRealCapacity,
                  garbageNum: e.greenBean.garbageNum,
                  garbageClassifyNum: e.greenBean.garbageClassifyNum,
                  isWaterStandard: e.greenBean.isWaterStandard,
                  isSewageDetection: e.greenBean.isSewageDetection,
                  isGarbageClassify: e.greenBean.isGarbageClassify,
                  isGarbageHarmless: e.greenBean.isGarbageHarmless,
                  isWaterReuse: e.greenBean.isWaterReuse,
                  isGarbageRecovery: e.greenBean.isGarbageRecovery,
                  isGreenEnergy: e.greenBean.isGreenEnergy,
                  greenEnergy: e.greenBean.greenEnergy,
              },
              infoBean: {
                isInfoPublish: e.infoBean.greenEnergy, //  是否有信息发布系统 0否1是
                isServiceSatisfaction: e.infoBean.greenEnergy, // 是否开展服务质量满意度检查 0否1是
                isBroadcastSystem: e.infoBean.greenEnergy, // 是否设有广播呼叫系统 0否1是
                isMultiMedia: e.infoBean.greenEnergy,// 是否设置多媒体信息发布终端 0否1是
                isOnline: e.infoBean.greenEnergy,// 是否通过互联网发布服务 0否1是
                isInfoQuery: e.infoBean.greenEnergy, // 是否设置信息查询设置 0否1是
                basServiceAreaInfoPublishList:e.infoBean.basServiceAreaInfoPublishList === null?[{
                  equipmentNum:e.infoBean.greenEnergy.equipmentNum, // 设备编号
                  equityUnit:e.infoBean.greenEnergy.equityUnit,// 产权单位
                  useUnit:e.infoBean.greenEnergy.useUnit,// 使用单位,
                  useClass:e.infoBean.greenEnergy.useClass,// 使用分类
                  equipmentClass:e.infoBean.greenEnergy.equipmentClass,// 设备分类
                  displaySize:e.infoBean.greenEnergy.displaySize,// 显示尺寸
                  displayArea:e.infoBean.greenEnergy.displayArea,// 显示屏面积（平方米）
                  signalNetwork:e.infoBean.greenEnergy.signalNetwork,// 信号网络方式
                  site:e.infoBean.greenEnergy.site,// 位置
                  equipmentProducer:e.infoBean.greenEnergy.equipmentProducer,// 设备生产商
                  softwareControlSystem:e.infoBean.greenEnergy.softwareControlSystem,// 软件控制系统
                  infoPublishControlSystem:e.infoBean.greenEnergy.infoPublishControlSystem,// 信息发布控制方式
                  sceneManagePerson:e.infoBean.greenEnergy.sceneManagePerson,// 现场管理负责人及联系方式
                  infoAuditPerson:e.infoBean.greenEnergy.infoAuditPerson,// 信息审核责任领导及联系方式
                  infoPublishPerson:e.infoBean.greenEnergy.infoPublishPerson,// 信息发布责任领导及联系方式
                }] : e.infoBean.basServiceAreaInfoPublishList,
              },
              limoCampBean: {
                  isLimoCamp: e.limoCampBean.isLimoCamp,
                  limoCampNum: e.limoCampBean.limoCampNum,
                  isBasicService: e.limoCampBean.isBasicService,
                  isTelBook: e.limoCampBean.isTelBook,
                  isOnlineBook: e.limoCampBean.isOnlineBook,
              },
              marketBean: {
                  isSupermarket: e.marketBean.isSupermarket,
                  supermarketRunBusiness: e.marketBean.supermarketRunBusiness,
                  supermarketBusinessScope: e.marketBean.supermarketBusinessScope,
                  supermarketArea: e.marketBean.supermarketArea,
                  samePriceGoods: e.marketBean.samePriceGoods,
                  localCharacteristicsGoods: e.marketBean.localCharacteristicsGoods,
                  personInChargeMarket: e.marketBean.personInChargeMarket,
                  telephoneMarket: e.marketBean.telephoneMarket,
              },
              medicalBean: {
                  isMedicalService: e.medicalBean.isMedicalService,
                  isMedicalStation: e.medicalBean.isMedicalStation,
                  isMedicalEmergency: e.medicalBean.isMedicalEmergency,
                  isNonPrescriptionDrugs: e.medicalBean.isNonPrescriptionDrugs,
              },
              monitorBean: {
                  isMonitor: e.monitorBean.isMonitor,
                  cameraNum: e.monitorBean.cameraNum,
                  highCameraNum: e.monitorBean.highCameraNum,
                  lowCameraNum: e.monitorBean.lowCameraNum,
              },
              officeBean: {
                  officeArea: e.officeBean.officeArea,
                  officeRoomNum: e.officeBean.officeRoomNum,
              },
              personBean: {
                  managePersonNum: e.personBean.managePersonNum,
                  assistNum: e.personBean.assistNum,
                  securityGuardNum: e.personBean.securityGuardNum,
                  procterGambleNum: e.personBean.procterGambleNum,
                  cateringStaffNum: e.personBean.cateringStaffNum,
                  salesmanNum: e.personBean.salesmanNum,
                  electricianNum: e.personBean.electricianNum,
                  gasStationPerson: e.personBean.gasStationPerson,
                  ableAccommodationNum: e.personBean.ableAccommodationNum,
                  ownerManageNum: e.personBean.ownerManageNum,
                  operateManageNum: e.personBean.operateManageNum,
                  operateServiceNum: e.personBean.operateServiceNum,
                  informationNum: e.personBean.informationNum,
                  guaranteeNum: e.personBean.guaranteeNum,
              },
              rescueBean: {
                  isRescue: e.rescueBean.isRescue,
                  isRescueBarrier: e.rescueBean.isRescueBarrier,
                  isRescueCall: e.rescueBean.isRescueCall,
                  isRescueApron: e.rescueBean.isRescueApron,
              },
              roomBean: {
                  isAccommodation: e.roomBean.isAccommodation,
                  guestRoomNum: e.roomBean.guestRoomNum,
                  standardRoomNum: e.roomBean.standardRoomNum,
                  bedsNum: e.roomBean.bedsNum,
              },
              showerBean: {
                  isShower: e.showerBean.isShower,
                  showerNum: e.showerBean.showerNum,
                  manShowerNum: e.showerBean.manShowerNum,
                  womanShowerNum: e.showerBean.womanShowerNum,
              },
              superviseBean: {
                  isSupervise: e.superviseBean.isSupervise,
                  isSuperviseBoard: e.superviseBean.isSuperviseBoard,
                  isSuperviseTel: e.superviseBean.isSuperviseTel,
                  isComplaintDesk: e.superviseBean.isComplaintDesk,
              },
              toiletBean: {
                  isToilet: e.toiletBean.isToilet,
                  manUrinalNum: e.toiletBean.manUrinalNum,
                  manHoleNum: e.toiletBean.manHoleNum,
                  manSeatThenNum: e.toiletBean.manSeatThenNum,
                  womanHoleNum: e.toiletBean.womanHoleNum,
                  womanSeatThenNum: e.toiletBean.womanSeatThenNum,
                  accessibleToiletNum: e.toiletBean.accessibleToiletNum,
                  thirdToiletNum: e.toiletBean.thirdToiletNum,
                  thirdSeatNum: e.toiletBean.thirdSeatNum,
                  mobileToiletSquatNum: e.toiletBean.mobileToiletSquatNum,
              },
              waterBean: {
                  isAddWater: e.waterBean.isAddWater,
                  waterGunNum: e.waterBean.waterGunNum,
                  operateWater: e.waterBean.operateWater,
                  personInChargeWater: e.waterBean.personInChargeWater,
                  telephoneWater: e.waterBean.telephoneWater,
              },
              electricityBean:{
                projectEntity:e.electricityBean.projectEntity, // 项目法人
                constructionUnit:e.electricityBean.constructionUnit, // 建设单位
                constructionState:e.electricityBean.constructionState, // 建设状态
                photoType:e.electricityBean.photoType, // 类型  独立光伏 0/分布式光伏 1
                photoScene:e.electricityBean.photoScene, // 光伏场景
                synchronizeMode:e.electricityBean.synchronizeMode?? [], // 并网模式 自发自用0；自发自用1，余电上网2；全额上网3
                isEnergyDevice:e.electricityBean.isEnergyDevice, // 是否有储能设备
                totalPhotoCapacity:e.electricityBean.totalPhotoCapacity, // 光伏设备总容量（千瓦）
                totalEnergyCapacity:e.electricityBean.totalEnergyCapacity, // 储能设备总容量（千瓦）
                annualAverageCapacity :e.electricityBean.annualAverageCapacity, // 年平均容量（千瓦）
                annualAverageHours :e.electricityBean.annualAverageHours, // 年均发电小时
                annualAverageOnlineCapacity :e.electricityBean.annualAverageOnlineCapacity, // 年均上网电量（千瓦时）
                actualTime :e.electricityBean.actualTime, // 建成投用时间
                gridConnectionTime :e.electricityBean.gridConnectionTime, // 并网时间
                gridConnectionVoltageLevel :e.electricityBean.gridConnectionVoltageLevel, // 并网电压等级
                note :e.electricityBean.note, // 备注
              },
              driverHouseBean:{
                isHome:e.driverHouseBean.isHome, // 是否建设货车“司机之家 0否1是
                distance:e.driverHouseBean.distance, // 距离重庆主城距离（KM）
                homeArea:e.driverHouseBean.homeArea, // 司机之家房屋面积（m2）
                totalNum:e.driverHouseBean.totalNum, // 能同时容纳人数
                annualPersonNum:e.driverHouseBean.annualPersonNum, // 年人均使用人数
                serviceFunction:e.driverHouseBean.serviceFunction, // 司机之家”服务功能
                description:e.driverHouseBean.description, // 简要说明
                descriptionImageList:e.driverHouseBean.descriptionImageList, // 描述图片
                isStandardHouse:e.driverHouseBean.isStandardHouse, // 是否按照标准设计打造 0否1是
                isStandardDesign:e.driverHouseBean.isStandardDesign, // 是否按照标准设计打造 0否1是
                isPass:e.driverHouseBean.isPass, // 是否通过验收 0否1是
                constructedUnit:e.driverHouseBean.constructedUnit, // 投建单位
                constructedCost:e.driverHouseBean.constructedCost, // 投资建设费用
                manageUnit:e.driverHouseBean.manageUnit, // 管理单位
                sitePrincipal:e.driverHouseBean.sitePrincipal, // 现场负责人
                sitePrincipalTel:e.driverHouseBean.sitePrincipalTel, // 现场负责人电话
                buildTime:e.driverHouseBean.buildTime, // 建成时间
                isStation:e.driverHouseBean.isStation, // 是否为同心驿站 0否1是
                specialService:e.driverHouseBean.specialService, // 特色服务
                specialServiceImageList:e.driverHouseBean.specialServiceImageList
              }
          };
          this.dealnavigaSource(dealFormInfo);
        },

        /**
         * @description 新增保存
         */
        saveAreaInfo() {
            this.dealLine();
            const formData = new FormData();
            formData.append("request", JSON.stringify(this.formInfo));
            formData.append("file", this.upLoadImg);
            // 加载
            const subLoading = ElLoading.service({
                lock: true,
                text: "获取数据中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            addServiceAreaInfo(formData)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.message);
                        this.drawerStatus = false;
                    }
                    subLoading.close();
                })
                .catch((err) => {
                    ElMessage.error(err);
                    subLoading.close();
                });
        },

        /**
         * @description 编辑保存
         */
        editSaveAreaInfo() {
            this.dealLine();
            this.formInfo.basicBean.road = String(this.formInfo.basicBean.road);
            this.formInfo.basicBean.highSpeed = String(this.formInfo.basicBean.highSpeed);
            const formData = new FormData();
            formData.append("request", JSON.stringify(this.formInfo));
            formData.append("file", this.upLoadImg);
            // 加载
            const subLoading = ElLoading.service({
                lock: true,
                text: "获取数据中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            editServiceAreaInfo(formData)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.message);
                        this.drawerStatus = false;
                    }
                    subLoading.close();
                })
                .catch((err) => {
                    ElMessage.error(err);
                    subLoading.close();
                });
        },

        /**
         * @description 代办保存
         */
        todoSaveAreaInfo() {
            this.dealLine();
            const formData = new FormData();
            formData.append("request", JSON.stringify(this.formInfo));
            formData.append("file", this.upLoadImg);
            // 加载
            const subLoading = ElLoading.service({
                lock: true,
                text: "获取数据中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            editServiceAreaInfo(formData)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.message);
                        this.drawerStatus = false;
                    }
                    subLoading.close();
                })
                .catch((err) => {
                    ElMessage.error(err);
                    subLoading.close();
                });
        },

        /**
         * @description 启动流程
         */
        startProcess() {
            this.dealLine();
            const formData = new FormData();
            let subParam = {
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                param: {
                    procDefKey: "Process_service_area_info",
                },
                variables: {
                    isCancelled: 0,
                    ...this.formInfo,
                },
            };
            // 加载
            const subLoading = ElLoading.service({
                lock: true,
                text: "获取数据中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            // isCancelled通过0，驳回1
            formData.append("request", JSON.stringify(subParam));
            startProcessInterface(formData)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.message);
                        this.drawerStatus = false;
                    }else if(res.code === 500){
                      ElMessage.error(res.message);
                    }
                    subLoading.close();
                })
                .catch((err) => {
                    ElMessage.error(err);
                    subLoading.close();
                });
        },

        /**
         * @description 流程完成
         */
        processCompleted() {
            this.dealLine();
            const formData = new FormData(),
                tenantId = process.env.VUE_APP_BASE_TENANTID;
            formData.append("request", JSON.stringify({ variables: this.formInfo, tenantId }));
            formData.append("file", this.upLoadImg);
            processCompletedInterface(formData)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.message);
                        this.drawerStatus = false;
                    }
                })
                .catch((err) => {
                    ElMessage.error(err);
                });
        },
        // 审核提交
        processSub() {
            this.dealLine();
            const formData = new FormData();
            let subParam = {
                tenantId: process.env.VUE_APP_BASE_TENANTID,
                param: {
                    procDefKey: "Process_service_area_info",
                },
                taskId: this.taskId,
                procInsId: this.procInstId,
                comment: this.formInfo.comment,
                variables: {
                    isCancelled: this.formInfo.isStatus,
                    ...this.formInfo,
                },
            };
            // 加载
            const subLoading = ElLoading.service({
                lock: true,
                text: "获取数据中",
                background: "rgba(0, 0, 0, 0.7)",
            });
            // isCancelled通过0，驳回1
            formData.append("request", JSON.stringify(subParam));
            formData.append("file", this.upLoadImg);
            processCompletedInterface(formData)
                .then((res) => {
                    if (res.code === 200) {
                        ElMessage.success(res.data.message);
                        this.drawerStatus = false;
                    }
                    subLoading.close();
                })
                .catch((err) => {
                    ElMessage.error(err);
                    subLoading.close();
                });
        },

        /**
         * @description 处理数据
         */
        dealLine() {
            this.formInfo.basicBean.road = String(this.formInfo.basicBean.road);
            this.formInfo.basicBean.highSpeed = String(this.formInfo.basicBean.highSpeed);
        },
        /**
         * @description 获取公司列表
         */
        getCompanyList() {
            getCompany().then((res) => {
                if (res.code === 200) {
                    this.companyList = res.data.records;
                }
            });
        },
        
        /**
         * @description 获取管理公司列表
         */
        getOrgList() {
            getOrg().then((res) => {
                if (res.code === 200) {
                    this.orgList = res.data.records;
                }
            });
        },

        /**
         * @description 获取字典项
         */
        getDictItemsList() {
            const dictItems = {
                queriers: [
                    { alias: "starLevelDictionary", param: null }, // 星级
                    { alias: "layoutFormDictionary", param: null }, // 布局形式
                    { alias: "serviceDirectionDictionary", param: null }, //服务区方向
                    { alias: "auditStatusDictionary", param: null }, // 审核状态
                    { alias: "serviceAreaStatusDictionary", param: null }, // 服务区状态
                    { alias: "serviceTypeDictionary", param: null }, // 服务区类别
                    { alias: "sideTypeDictionary", param: null }, // 左右侧
                    { alias: "serviceUnitNatureDictionary", param: null }, // 经营管理单位性质
                    { alias: "serviceModeDictionary", param: null }, // 服务区经营模式
                    { alias: "tollStationDictionary", param: null }, // 起始收费站, 结束收费站
                    { alias: "roadTypeDictionary", param: null }, // 路段类型
                    { alias: "mealsKindsCodeDictionary", param: null }, // 餐饮种类
                    { alias: "chargingTypeDictionary", param: null }, // 充电桩类型
                    { alias: "exStationTypeDictionary", param: null }, // 换电站类型
                    { alias: "sewageTreatmentModeDictionary", param: null }, // 污水处理模式
                    { alias: "vehicleTypeDictionary", param: null }, // ETC车道通行车辆类型
                    { alias: "chargingBrandDictionary", param: null }, // 充电桩品牌
                    { alias: "chargingWayDictionary", param: null }, // 充电形式
                    { alias: "exchangeStatusDictionary", param: null }, //  状态
                    { alias: "basAreaInfoPublicDictionary", param: null }, //  是否 
                    { alias: "basAreaInfoModeDictionary", param: null }, //  并网模式
                    { alias: "basAreaInfoConstructionStateDictionary", param: null }, //  建设状态
                    { alias: "basAreaInfoServiceDictionary", param: null }, //  司机之家'服务功能  
                    { alias: "stationStatusDictionary", param: null }, //  站点状态 
                    { alias: "stationTypeDictionary", param: null }, //  站点类型 
                    { alias: "stationParkTypeDictionary", param: null }, //  停车费类型
                    { alias: "stationConstructionDictionary", param: null }, //  建设场所
                    { alias: "stationEnvironmentDictionary", param: null }, //  周边环境
                    { alias: "stationSupportingDictionary", param: null }, //  配套设施
                    { alias: "stationEquipmentTypeDictionary", param: null }, //  充电桩设备类型
                    { alias: "infoPubDeviceClassDictionary", param: null }, //  设备分类
                    { alias: "infoPubNetDictionary", param: null }, //  信号网络方式
                    { alias: "infoPubSiteDictionary", param: null }, //  位置
                    { alias: "infoPubUseClassDictionary", param: null }, //  使用分类
                    { alias: "stationPayDictionary", param: null }, //  支付方式
                    { alias: "v2ClassDictionary", param: null }, //  V2G站的类别
                    { alias: "basAreaInfoElectTypeDictionary", param: null }, //  光伏发电-类型
                    { alias: "basAreaInfoElectDisDictionary", param: null }, //  光伏发电-分布式光伏
                    { alias: "basAreaInfoElectIndDictionary", param: null }, //  光伏发电-独立光伏
                      
                ],
            };
            getDictItems(dictItems).then((res) => {
                if (res.code === 200) {
                    this.dictItemsList = res.data;
                }
            });
        },

        /**
         * @description 获取道路列表
         */
        getRoadList() {
            getRoad()
                .then((res) => {
                    if (res.code === 200) {
                        this.roadList = res.data.records;
                    }
                })
                .catch((err) => {
                    ElMessage.error(err);
                });
        },
        /**
         * @description 获取道路线路列表
         */
        getRoadLineList() {
            getRoadLine()
                .then((res) => {
                    if (res.code === 200) {
                        this.roadLineList = res.data.records;
                    }
                })
                .catch((err) => {
                    ElMessage.error(err);
                });
        },

        /**
         * @description 获取公司负责人列表
         */
        getCompanyManagerList() {
            getCompanyManager()
                .then((res) => {
                    if (res.code === 200) {
                        this.companyManagerList = res.data.records;
                    }
                })
                .catch((err) => {
                    ElMessage.error(err);
                });
        },
        // 新增信息发布
        addBasServiceAreaInfoPublishList() {
          this.formInfo.infoBean.basServiceAreaInfoPublishList.push({
            isInfoPublish: '1', //  是否有信息发布系统 0否1是
            isServiceSatisfaction: '1', // 是否开展服务质量满意度检查 0否1是
            isBroadcastSystem: '1', // 是否设有广播呼叫系统 0否1是
            isMultiMedia: '1',// 是否设置多媒体信息发布终端 0否1是
            isOnline: '1',// 是否通过互联网发布服务 0否1是
            isInfoQuery: '1', // 是否设置信息查询设置 0否1是
            basServiceAreaInfoPublishList:[{
              equipmentNum:null, // 设备编号
              equityUnit:null,// 产权单位
              useUnit:null,// 使用单位
              useClass:null,// 使用分类
              equipmentClass:null,// 设备分类
              displaySize:null,// 显示尺寸
              displayArea:null,// 显示屏面积（平方米）
              signalNetwork:null,// 信号网络方式
              site:null,// 位置
              equipmentProducer:null,// 设备生产商
              softwareControlSystem:null,// 软件控制系统
              infoPublishControlSystem:null,// 信息发布控制方式
              sceneManagePerson:null,// 现场管理负责人及联系方式
              infoAuditPerson:null,// 信息审核责任领导及联系方式
              infoPublishPerson:null,// 信息发布责任领导及联系方式
            }]
          })
          this.validatorRules.infoBean.basServiceAreaInfoPublishList.push({
            equityUnit:[{ required: true, message: "请输入产权单位!" }],// 产权单位
            useUnit:[{ required: true, message: "请输入使用单位!" }],// 使用单位
            useClass:[{ required: true, message: "请选择使用分类!" }],// 使用分类
            equipmentClass:[{ required: true, message: "请选择设备分类!" }],// 设备分类
            displaySize:[{ required: true, message: "请输入显示尺寸!" }],// 显示尺寸
            displayArea:[{ required: true, message: "请输入显示面积!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 显示屏面积（平方米）
            signalNetwork:[{ required: true, message: "请选择信号网络方式!" }],// 信号网络方式
            site:[{ required: true, message: "请选择位置!" }],// 位置
            equipmentProducer:[{ required: true, message: "请输入设备生产商!" }],// 设备生产商
            softwareControlSystem:[{ required: true, message: "请输入软件控制系统!" }],// 软件控制系统
            infoPublishControlSystem:[{ required: true, message: "请输入信息发布控制方式!" }],// 信息发布控制方式
            sceneManagePerson:[{ required: true, message: "请输入现场管理负责人及联系方式!" }],// 现场管理负责人及联系方式
            infoAuditPerson:[{ required: true, message: "请输入信息审核责任领导及联系方式!" }],// 信息审核责任领导及联系方式
            infoPublishPerson:[{ required: true, message: "请输入信息发布责任领导及联系方式!" }],// 信息发布责任领导及联系方式
          })
        },
         /**
         * @description 删除信息发布
         */
         deleteBasServiceAreaInfoPublish(index) {
          this.formInfo.infoBean.basServiceAreaInfoPublishList.splice(index, 1);
          this.validatorRules.infoBean.basServiceAreaInfoPublishList.splice(index, 1);
          this.setTotal();
        },
        // 初始化新增信息发布
        initNewChargingStation(){
          this.formInfo.energyBean.chargeStationList.push({
            stationName: null,// 充电站名称
            stationAddress: null,// 充电站地址
            longitude: null,// 经度
            latitude: null,// 纬度
            transformerCapacity: null,// 箱变容量（kVA）
            ratedTotalPower: null,// 额定总功率（kW）
            isIntegratedStorage: '0',// 是否为充储一体化站 0否 1是
            energyStorageCapacity: null,// 储能配置规模（kWh）
            dischargeDuration: null,// 放电时间（h）
            hasSolarPower: '0',// 是否有光伏供能 0否 1是
            solarPowerCapacity: null,// 光伏配置规模（kWp）
            isV2gStation: '0',// 是否为V2G充电站 0否 1是
            v2gStationType: null,// V2G充电站类型
            v2gPileCount: null,// V2G充电桩数量
            v2gDischargePower: null,// V2G放电功率（kW）
            cameraCount: null,// 充电站摄像机数量
            hasCanopy: "1",// 是否有车棚 0否 1是
            stationStatus: null,// 充电站状态
            stationType: null,// 充电站类型
            parkingFeeType: null,// 停车费类型
            is24HoursOperation: '1',// 是否24小时开放 0否 1是
            paymentMethods: [],// 支付方式 多个逗号分隔
            stationPhone: null,// 充电站电话
            servicePhone: null,// 服务电话
            constructionLocation: null,// 建设场所
            surroundingEnvironment: null,// 周边环境
            surroundingFacilities: [],// 周边设施 多个逗号分隔
            builtTime: null,// 建设时间
            commissioningTime: null,// 投运时间
            stationPhotosList : [],// 充电站照片 多个逗号分隔
          });
        },
        /**
         * @description 新增充电站
         */
        addNewChargingStation() {
            this.initNewChargingStation();
            this.validatorRules.energyBean.chargeStationList.push({
                stationName: [{ required: true, message: "请输入充电站名称!" }],// 充电站名称
                longitude: [{ required: true, message: "请输入经度!" , trigger: "blur"}, {
                                pattern: /^(?:\d+|\d*\.\d{1,6})$/, 
                                message: "请输入经度小数点后6位",
                                trigger: "blur"
                            }],// 经度
                latitude: [{ required: true, message: "请输入纬度!" ,trigger: "blur"},{
                                pattern: /^(?:\d+|\d*\.\d{1,6})$/, 
                                message: "请输入经度小数点后6位",
                                trigger: "blur"
                            }],// 纬度
                transformerCapacity: [{ required: true, message: "请输入箱变容量（kVA）!" },{
                                      validator: (rule, value, callback) => {
                                        if (Number(value) <= 0) {
                                          callback(new Error("请输入箱变容量（kVA）必须大于0的数字"));
                                        } if(isNaN(Number(value))){
                                          callback(new Error("请输入箱变容量（kVA）必须大于0的数字"));
                                        }else {
                                          callback();
                                        }
                                      },
                                      trigger: "blur"
                                    }],// 箱变容量（kVA）
                ratedTotalPower: [{ required: true, message: "请输入额定总功率（kW）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入额定总功率（kW）大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 额定总功率（kW）
                isIntegratedStorage: [{ required: true, message: "请选择是否为充储一体化站!" }],// 是否为充储一体化站 0否 1是
                energyStorageCapacity: [{ required: true, message: "请输入储能配置规模（kWh）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("必须大于0"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 储能配置规模（kWh）
                dischargeDuration: [{ required: true, message: "请输入放电时间（h）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("必须大于0"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 放电时间（h）
                hasSolarPower: [{ required: true, message: "请选择是否有光伏供能!" }],// 是否有光伏供能 0否 1是
                solarPowerCapacity: [{ required: true, message: "请输入光伏配置规模（kWp）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("必须大于0"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 光伏配置规模（kWp）
                isV2gStation: [{ required: true, message: "请选择是否为V2G充电站!" }],// 是否为V2G充电站 0否 1是
                v2gStationType: [{ required: true, message: "请输入V2G充电站类型!" }],// V2G充电站类型
                v2gPileCount: [{ required: true, message: "请输入V2G充电桩数量!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入V2G充电桩数量须大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// V2G充电桩数量
                v2gDischargePower: [{ required: true, message: "请输入V2G放电功率（kW）!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入V2G放电功率（kW）大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// V2G放电功率（kW）
                cameraCount: [{ required: true, message: "请输入充电站摄像机数量!" },{
                                    validator: (rule, value, callback) => {
                                      if (Number(value) <= 0) {
                                        callback(new Error("请输入充电站摄像机数量大于0的整数"));
                                      } else {
                                        callback();
                                      }
                                    },
                                    trigger: "blur"
                                  }],// 充电站摄像机数量
                hasCanopy: [{ required: true, message: "请选择是否有车棚!" }],// 是否有车棚 0否 1是
                stationStatus: [{ required: true, message: "请选择充电站状态!" }],// 充电站状态
                stationType: [{ required: true, message: "请选择充电站类型!" }],// 充电站类型
                parkingFeeType: [{ required: true, message: "请选择停车费类型!" }],// 停车费类型
                is24HoursOperation: [{ required: true, message: "请选择是否24小时开放!" }],// 是否24小时开放 0否 1是
                paymentMethods: [{ required: true, message: "请选择支付方式!" }],// 支付方式 多个逗号分隔
                stationPhone: [{ required: true, message: "请输入充电站电话!" }],// 充电站电话
                servicePhone: [{ required: true, message: "请输入服务电话!" }],// 服务电话
                constructionLocation: [{ required: true, message: "请选择建设场所!" }],// 建设场所
                surroundingEnvironment: [{ required: true, message: "请选择周边环境!" }],// 周边环境
                surroundingFacilities: [{ required: true, message: "请选择周边设施!" }],// 周边设施 多个逗号分隔
                builtTime: [{ required: true, message: "请选择建设时间!" }],// 建设时间
                commissioningTime: [{ required: true, message: "请选择启用时间!" }],// 启用时间
                stationPhotosList : [{ required: true, message: "请上传充电站照片（最多3张）!",trigger:['blur','change'] },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请上传充电站照片（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 充电站照片 多个逗号分隔
              });
            this.setTotal();
        },

        /**
         * @description 删除充电站
         */
        deleteChargingStation(index) {
            const deleteStation = this.formInfo.energyBean.chargeStationList.splice(index, 1);
            this.validatorRules.energyBean.chargeStationList.splice(index, 1);
            if (deleteStation[0].stationName) {
              this.formInfo.energyBean.chargePileList.forEach((item) => {
                if (item.stationName == deleteStation[0].stationName) {
                  this.formInfo.energyBean.chargePileList.splice(item, 1);
                  this.validatorRules.energyBean.chargePileList.splice(index, 1);
                } 
              })
            }
            
            this.setTotal();
        },
        // 初始化新增充电桩
        initNewChargingPiles(){
          this.formInfo.energyBean.chargePileList.push({
            serviceAreaId: null,// 服务区域ID
            stationName: null,// 充电站名称
            chargerCount: null,// 充电桩数量
            deviceCode: null,// 设备编码
            deviceName: null,// 设备名称
            deviceType: null,// 设备类型
            totalPower: null,// 充电设备总功率（kW）
            maxPower: null,// 充电设备最大功率（kW）
            gunCount: null,// 充电枪数量
            voltageRange: null,// 电压范围
            manufacturer: null,// 生产厂家
            maxCurrent: null,// 充电设备最大电流（A）
            builtTime: null,// 建设时间
            operationTime: null,// 运营时间
            gunImagesList: [],// 充电桩充电枪数图片（最多3张）
            nameplateImagesList: [],// 充电桩铭牌图片（最多3张）
            inspectionReportImagesList: [],// 第三方检测报告（最多3张）
            chargeGunList:[// 充电枪列表
              { 
                interfaceCode: null,// 充电设备接口编码
                interfaceName: null,// 充电设备接口名称
                isLinkedToCheck: null,// 是否与第三方检测系统对接 0否 1是
              }
            ]
          }); 
        },
        // 新增充电桩
        addNewChargingPiles(){
            this.initNewChargingPiles();
            this.validatorRules.energyBean.chargePileList.push({ // 充电桩列表
                stationName: [{ required: true, message: "请选择充电桩所属充电站!" }],// 充电站名称
                chargerCount: [{ required: true, message: "请输入充电桩数量!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电桩数量
                deviceCode: [{ required: true, message: "请输入设备编码!" }],// 设备编码
                deviceType: [{ required: true, message: "请输入设备类型!" }],// 设备类型
                totalPower: [{ required: true, message: "请输入充电设备总功率（kW）!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电设备总功率（kW）
                maxPower: [{ required: true, message: "请输入充电设备最大功率（kW）!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电设备最大功率（kW）
                gunCount: [{ required: true, message: "请输入充电枪数量!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电枪数量
                voltageRange: [{ required: true, message: "请输入电压范围!" }],// 电压范围
                manufacturer: [{ required: true, message: "请输入生产厂家!" }],// 生产厂家
                maxCurrent: [{ required: true, message: "请输入充电设备最大电流（A）!" },{
                                validator: (rule, value, callback) => {
                                  if (Number(value) <= 0) {
                                    callback(new Error("必须大于0"));
                                  } else {
                                    callback();
                                  }
                                },
                                trigger: "blur"
                              }],// 充电设备最大电流（A）
                builtTime: [{ required: true, message: "请输入建设时间!" }],// 建设时间
                operationTime: [{ required: true, message: "请输入运营时间!" }],// 运营时间
                gunImagesList: [{ required: true, message: "请上传充电桩充电枪数图片（最多3张）!",trigger:['blur','change'] },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请上传充电桩充电枪数图片（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 充电桩充电枪数图片（最多3张）
                nameplateImagesList: [{ required: true, message: "请输入充电桩铭牌图片（最多3张）!" },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请输入充电桩铭牌图片（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 充电桩铭牌图片（最多3张）
                inspectionReportImagesList: [{ required: true, message: "请输入第三方检测报告（最多3张）!" },{
                    validator: (rule, value, callback) => {
                        if (value.length === 0) {
                            callback("请输入第三方检测报告（最多3张）");
                        } else {
                            callback();
                        }
                    },
                }],// 第三方检测报告（最多3张）
                chargeGunList:[// 充电枪列表
                  { 
                    interfaceCode: [{ required: true, message: "请输入充电设备接口编码!" }],// 充电设备接口编码
                    isLinkedToCheck: [{ required: true, message: "请输入是否与第三方检测系统对接!" }],// 是否与第三方检测系统对接 0否 1是
                  }
                ]
              });
            this.setTotal();
        },
        // 删除充电桩
        deleteChargingPiles(index) {
          this.formInfo.energyBean.chargePileList.splice(index, 1);
          this.validatorRules.energyBean.chargePileList.splice(index, 1);
          this.setTotal();
        },
        // 新增充电枪
        addNewChargeGun(index){
            this.formInfo.energyBean.chargePileList[index].chargeGunList.push({
              interfaceCode: null,// 充电设备接口编码
              interfaceName: null,// 充电设备接口名称
              isLinkedToCheck: null,// 是否与第三方检测系统对接 0否 1是
            });
            this.validatorRules.energyBean.chargePileList[index].chargeGunList.push({
                interfaceCode: [{ required: true, message: "请输入充电设备接口编码!" }],// 充电设备接口编码
                isLinkedToCheck: [{ required: true, message: "请输入是否与第三方检测系统对接!" }],// 是否与第三方检测系统对接 0否 1是
              });
            this.setTotal();
        },
        // 删除
        deleteChargeGun(index,_index){
          this.formInfo.energyBean.chargePileList[index].chargeGunList.splice(_index, 1);
          this.validatorRules.energyBean.chargePileList[index].chargeGunList.splice(_index, 1);
          this.setTotal();
        },
        /**
         * @description 计算总条数
         */
        setTotal() {
            let chargingStationListLength = Object.keys(
                this.formInfo.energyBean.chargeStationList[0]
            ).length;
             let chargePileListLength = Object.keys(
                this.formInfo.energyBean.chargePileList[0]
            ).length;
            
            let basServiceAreaInfoPublishListLength = Object.keys(
              this.formInfo.infoBean.basServiceAreaInfoPublishList[0]
            ).length;
            let navLength = this.navigationList.length;
            let obj = {};
            if (this.flag == "add" || this.flag == "backlog") {
                for (let i = 0; i < navLength; i++) {
                    if (this.navigationList[i].name == "basicBean") {
                        obj = this.formInfo.basicBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "personBean") {
                        obj = this.formInfo.personBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "officeBean") {
                        obj = this.formInfo.officeBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "areaBean") {
                        obj = this.formInfo.areaBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "carBean") {
                        obj = this.formInfo.carBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "toiletBean") {
                        obj = this.formInfo.toiletBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "marketBean") {
                        obj = this.formInfo.marketBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "foodBean") {
                        obj = this.formInfo.foodBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "roomBean") {
                        obj = this.formInfo.roomBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "showerBean") {
                        obj = this.formInfo.showerBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "waterBean") {
                        obj = this.formInfo.waterBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "garageBean") {
                        obj = this.formInfo.garageBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "energyBean") {
                        obj = this.formInfo.energyBean;
                        this.navigationList[i].total = Object.keys(obj).length - 1;
                        this.navigationList[i].total +=
                            this.formInfo.energyBean.chargeStationList.length *
                            chargingStationListLength + this.formInfo.energyBean.chargePileList.length *chargePileListLength;
                    } else if (this.navigationList[i].name == "babyBean") {
                        obj = this.formInfo.babyBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "rescueBean") {
                        obj = this.formInfo.rescueBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "greenBean") {
                        obj = this.formInfo.greenBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "medicalBean") {
                        obj = this.formInfo.medicalBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "superviseBean") {
                        obj = this.formInfo.superviseBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "infoBean") {
                        obj = this.formInfo.infoBean;
                        this.navigationList[i].total = Object.keys(obj).length - 1;
                        this.navigationList[i].total +=
                            this.formInfo.infoBean.basServiceAreaInfoPublishList.length *
                            basServiceAreaInfoPublishListLength;
                    } else if (this.navigationList[i].name == "monitorBean") {
                        obj = this.formInfo.monitorBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "limoCampBean") {
                        obj = this.formInfo.limoCampBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "freeBean") {
                        obj = this.formInfo.freeBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "fireBean") {
                        obj = this.formInfo.fireBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    } else if (this.navigationList[i].name == "etcBean") {
                        obj = this.formInfo.etcBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    }else if (this.navigationList[i].name == "electricityBean") {
                        obj = this.formInfo.electricityBean;
                        this.navigationList[i].total = Object.keys(obj).length;
                    }else if (this.navigationList[i].name == "driverHouseBean") {
                        obj = this.formInfo.driverHouseBean;
                        this.navigationList[i].total = Object.keys(obj).length; 
                    }
                }
            }
            if (this.flag == "edit" || this.flag == "audit" || this.flag == "detail") {
                for (let i = 0; i < navLength; i++) {
                    if (this.navigationList[i].name == "basicBean") {
                        obj = this.formInfo.basicBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "personBean") {
                        obj = this.formInfo.personBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "officeBean") {
                        obj = this.formInfo.officeBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "areaBean") {
                        obj = this.formInfo.areaBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "carBean") {
                        obj = this.formInfo.carBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "toiletBean") {
                        obj = this.formInfo.toiletBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "marketBean") {
                        obj = this.formInfo.marketBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "foodBean") {
                        obj = this.formInfo.foodBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "roomBean") {
                        obj = this.formInfo.roomBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "showerBean") {
                        obj = this.formInfo.showerBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "waterBean") {
                        obj = this.formInfo.waterBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "garageBean") {
                        obj = this.formInfo.garageBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "energyBean") {
                        obj = this.formInfo.energyBean;
                        this.navigationList[i].total = Object.keys(obj).length - 1;
                        this.navigationList[i].total +=
                            this.formInfo.energyBean.chargeStationList.length *
                            chargingStationListLength + this.formInfo.energyBean.chargePileList.length *chargePileListLength;
                        this.navigationList[i].total -= 2;
                    } else if (this.navigationList[i].name == "babyBean") {
                        obj = this.formInfo.babyBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "rescueBean") {
                        obj = this.formInfo.rescueBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "greenBean") {
                        obj = this.formInfo.greenBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "medicalBean") {
                        obj = this.formInfo.medicalBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "superviseBean") {
                        obj = this.formInfo.superviseBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "infoBean") {
                        obj = this.formInfo.infoBean;
                        this.navigationList[i].total = Object.keys(obj).length - 1;
                        this.navigationList[i].total +=
                            this.formInfo.infoBean.basServiceAreaInfoPublishList.length *
                            basServiceAreaInfoPublishListLength;
                    } else if (this.navigationList[i].name == "monitorBean") {
                        obj = this.formInfo.monitorBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "limoCampBean") {
                        obj = this.formInfo.limoCampBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "freeBean") {
                        obj = this.formInfo.freeBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "fireBean") {
                        obj = this.formInfo.fireBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    } else if (this.navigationList[i].name == "etcBean") {
                        obj = this.formInfo.etcBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    }else if (this.navigationList[i].name == "electricityBean") {
                        obj = this.formInfo.electricityBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2;
                    }else if (this.navigationList[i].name == "driverHouseBean") {
                        obj = this.formInfo.driverHouseBean;
                        this.navigationList[i].total = Object.keys(obj).length - 2; 
                    }
                }
            }
        },
    },
});
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot));
}
