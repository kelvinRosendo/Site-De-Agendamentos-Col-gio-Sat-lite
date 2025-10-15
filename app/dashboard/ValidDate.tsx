export default function validDate(date: Date, repeat: string, endDate?: Date, weekDays?: string[]){    
    let valid = true;

    switch (repeat) {
        case 'norepeat':
            valid = date ? true : false;
            break;
        case 'everyday':
            valid = endDate! > date;
            break;
        case 'weekly':
            valid = endDate! > date && weekDays!.length > 0;
            break;
        default:
            console.error('Invalid repeating schedule!');
            valid = false;
            break;
    }

    return valid;
}