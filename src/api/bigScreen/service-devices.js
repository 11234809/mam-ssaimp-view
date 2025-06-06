import {doPost} from '@/utils/requestUtils'

export function getServiceEquipment(data) {
    const url = "/integrate/manage/getServiceEquipment";
    return doPost(url, data);
}

export function getServiceCar(data) {
    const url = "/integrate/manage/getServiceCar";
    return doPost(url, data);
}

export function getServicePerson(data) {
    const url = "/integrate/manage/getServicePerson";
    return doPost(url, data);
}

