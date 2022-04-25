export class ChannelPricing {


    public id: string;
    public is_gratis: boolean;

    public price_per_day: number;
    public price_per_month: number;
    public price_per_year: number;

    public currency: string;
    public currency_short:string;

    public min_renewal_amount: number;
    public min_renewal_type: "DAY"|"MONTH"|"YEAR";


    public channel_id: string;


    public start_at:string
    public supported_until:string

    public created_at: number;
    public updated_at: string;

 
}
