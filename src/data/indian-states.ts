export interface IndianState {
  code: string;
  name: string;
  type: 'state' | 'union_territory';
  zone?: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North-East';
  districts?: string[];
}

export const INDIAN_STATES: IndianState[] = [
  // 28 States
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    type: 'state',
    zone: 'South',
    districts: ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa', 'Nellore'],
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    type: 'state',
    zone: 'North-East',
    districts: ['Changlang', 'East Kameng', 'East Siang', 'Lohit', 'Papum Pare', 'Tawang', 'Tirap', 'West Kameng', 'West Siang'],
  },
  {
    code: 'AS',
    name: 'Assam',
    type: 'state',
    zone: 'North-East',
    districts: ['Barpeta', 'Cachar', 'Dibrugarh', 'Dhubri', 'Goalpara', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Nagaon', 'Sonitpur', 'Tinsukia'],
  },
  {
    code: 'BR',
    name: 'Bihar',
    type: 'state',
    zone: 'East',
    districts: ['Araria', 'Bhagalpur', 'Darbhanga', 'Gaya', 'Madhubani', 'Muzaffarpur', 'Nalanda', 'Patna', 'Purnia', 'Rohtas', 'Samastipur', 'Saran', 'Vaishali'],
  },
  {
    code: 'CG',
    name: 'Chhattisgarh',
    type: 'state',
    zone: 'Central',
    districts: ['Bastar', 'Bilaspur', 'Dantewada', 'Durg', 'Janjgir-Champa', 'Korba', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surguja'],
  },
  {
    code: 'GA',
    name: 'Goa',
    type: 'state',
    zone: 'West',
    districts: ['North Goa', 'South Goa'],
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    type: 'state',
    zone: 'West',
    districts: ['Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Kutch', 'Mehsana', 'Rajkot', 'Surat', 'Vadodara'],
  },
  {
    code: 'HR',
    name: 'Haryana',
    type: 'state',
    zone: 'North',
    districts: ['Ambala', 'Bhiwani', 'Faridabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Karnal', 'Panipat', 'Rohtak', 'Sonipat', 'Yamunanagar'],
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    type: 'state',
    zone: 'North',
    districts: ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kullu', 'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'],
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    type: 'state',
    zone: 'East',
    districts: ['Bokaro', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Hazaribagh', 'Palamu', 'Ranchi', 'West Singhbhum'],
  },
  {
    code: 'KA',
    name: 'Karnataka',
    type: 'state',
    zone: 'South',
    districts: ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Dakshina Kannada', 'Dharwad', 'Kalaburagi', 'Mysuru', 'Shivamogga', 'Tumakuru'],
  },
  {
    code: 'KL',
    name: 'Kerala',
    type: 'state',
    zone: 'South',
    districts: ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thrissur', 'Thiruvananthapuram', 'Wayanad'],
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    type: 'state',
    zone: 'Central',
    districts: ['Balaghat', 'Bhopal', 'Chhindwara', 'Gwalior', 'Hoshangabad', 'Indore', 'Jabalpur', 'Rewa', 'Sagar', 'Satna', 'Ujjain'],
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    type: 'state',
    zone: 'West',
    districts: ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad (Chhatrapati Sambhajinagar)', 'Kolhapur', 'Nagpur', 'Nanded', 'Nashik', 'Pune', 'Solapur', 'Thane'],
  },
  {
    code: 'MN',
    name: 'Manipur',
    type: 'state',
    zone: 'North-East',
    districts: ['Bishnupur', 'Churachandpur', 'Imphal East', 'Imphal West', 'Senapati', 'Thoubal', 'Ukhrul'],
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    type: 'state',
    zone: 'North-East',
    districts: ['East Garo Hills', 'East Khasi Hills', 'Jaintia Hills', 'Ri Bhoi', 'West Garo Hills', 'West Khasi Hills'],
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    type: 'state',
    zone: 'North-East',
    districts: ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saiha', 'Serchhip'],
  },
  {
    code: 'NL',
    name: 'Nagaland',
    type: 'state',
    zone: 'North-East',
    districts: ['Dimapur', 'Kohima', 'Mokokchung', 'Mon', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'],
  },
  {
    code: 'OD',
    name: 'Odisha',
    type: 'state',
    zone: 'East',
    districts: ['Balasore', 'Bhadrak', 'Cuttack', 'Ganjam', 'Jajpur', 'Kalahandi', 'Khordha', 'Koraput', 'Mayurbhanj', 'Puri', 'Sambalpur', 'Sundargarh'],
  },
  {
    code: 'PB',
    name: 'Punjab',
    type: 'state',
    zone: 'North',
    districts: ['Amritsar', 'Bathinda', 'Faridkot', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Ludhiana', 'Patiala', 'Sangrur'],
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    type: 'state',
    zone: 'North',
    districts: ['Ajmer', 'Alwar', 'Bikaner', 'Chittorgarh', 'Jaipur', 'Jodhpur', 'Kota', 'Nagaur', 'Sikar', 'Udaipur'],
  },
  {
    code: 'SK',
    name: 'Sikkim',
    type: 'state',
    zone: 'North-East',
    districts: ['East Sikkim (Gangtok)', 'North Sikkim (Mangan)', 'South Sikkim (Namchi)', 'West Sikkim (Geyzing)'],
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    type: 'state',
    zone: 'South',
    districts: ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Madurai', 'Salem', 'Thanjavur', 'Tiruchirappalli', 'Tirunelveli', 'Vellore'],
  },
  {
    code: 'TS',
    name: 'Telangana',
    type: 'state',
    zone: 'South',
    districts: ['Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahabubnagar', 'Medak', 'Nalgonda', 'Nizamabad', 'Ranga Reddy', 'Warangal'],
  },
  {
    code: 'TR',
    name: 'Tripura',
    type: 'state',
    zone: 'North-East',
    districts: ['Dhalai', 'North Tripura', 'South Tripura', 'West Tripura'],
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    type: 'state',
    zone: 'North',
    districts: ['Agra', 'Aligarh', 'Ayodhya', 'Azamgarh', 'Bareilly', 'Gorakhpur', 'Jhansi', 'Kanpur Nagar', 'Lucknow', 'Meerut', 'Prayagraj', 'Varanasi'],
  },
  {
    code: 'UK',
    name: 'Uttarakhand',
    type: 'state',
    zone: 'North',
    districts: ['Almora', 'Chamoli', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Tehri Garhwal', 'Udham Singh Nagar'],
  },
  {
    code: 'WB',
    name: 'West Bengal',
    type: 'state',
    zone: 'East',
    districts: ['Bankura', 'Birbhum', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Medinipur', 'South 24 Parganas'],
  },

  // 8 Union Territories
  {
    code: 'AN',
    name: 'Andaman and Nicobar Islands',
    type: 'union_territory',
    zone: 'South',
    districts: ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
  },
  {
    code: 'CH',
    name: 'Chandigarh',
    type: 'union_territory',
    zone: 'North',
    districts: ['Chandigarh'],
  },
  {
    code: 'DN',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    type: 'union_territory',
    zone: 'West',
    districts: ['Dadra and Nagar Haveli', 'Daman', 'Diu'],
  },
  {
    code: 'DL',
    name: 'Delhi (NCT)',
    type: 'union_territory',
    zone: 'North',
    districts: ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
  },
  {
    code: 'JK',
    name: 'Jammu and Kashmir',
    type: 'union_territory',
    zone: 'North',
    districts: ['Anantnag', 'Baramulla', 'Budgam', 'Doda', 'Jammu', 'Kathua', 'Kupwara', 'Pulwama', 'Rajouri', 'Srinagar', 'Udhampur'],
  },
  {
    code: 'LA',
    name: 'Ladakh',
    type: 'union_territory',
    zone: 'North',
    districts: ['Kargil', 'Leh'],
  },
  {
    code: 'LD',
    name: 'Lakshadweep',
    type: 'union_territory',
    zone: 'South',
    districts: ['Lakshadweep'],
  },
  {
    code: 'PY',
    name: 'Puducherry',
    type: 'union_territory',
    zone: 'South',
    districts: ['Karaikal', 'Mahe', 'Puducherry', 'Yanam'],
  },
];

export const INDIAN_STATE_OPTIONS = INDIAN_STATES.map((s) => ({
  value: s.name,
  label: s.name,
  code: s.code,
  type: s.type,
}));

export function getStateByCode(code: string): IndianState | undefined {
  return INDIAN_STATES.find((s) => s.code.toLowerCase() === code.toLowerCase());
}

export function getStateByName(name: string): IndianState | undefined {
  return INDIAN_STATES.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

export function getDistrictsForState(stateNameOrCode: string): string[] {
  const state =
    getStateByName(stateNameOrCode) ?? getStateByCode(stateNameOrCode);
  return state?.districts ?? [];
}
