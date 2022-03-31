var app = new Vue({
    el: '#hamming-encoder',
    data: {
        dataBits: [],
        status: '',
        numberOfDataBits: 4
    },
    created: function () {
        this.initDataBits(4);
    },
    methods: {
        initDataBits: function(){
            this.dataBits=[];
            
            for(var i=0;i<this.numberOfDataBits;i++){
                var bit = { data: null };
                this.dataBits.push(bit);
            }
        },
        send: function () {
            if (this.validate(this.dataBits) === true){
                var encodedMessage = this.encode(this.dataBits);
                  this.status = encodedMessage + ' encoded sent to server';

                return axios.put("http://localhost:3000/message", {bits: encodedMessage}).then(
                    response => (this.status = response.data)
                );
            } else {
                this.status = 'Input is not valid. Please use 0 or 1 as data bit values';
            }
        },
        encode: function(bits){
            var numberBitsData = parseInt(document.getElementById("inputNumber").value);
            var numberBitsControl = 0;
            while (Math.pow(2 ,numberBitsControl) < numberBitsData + numberBitsControl + 1){
                numberBitsControl++;
            }
            
            var v = [];
            var i = 0;
            var j = 0;
            for (var index = 0; index < numberBitsControl + numberBitsData; index++){
                if (index===Math.pow(2,i)-1){
                    v[index] = -1;
                    i++;
                } else {
                    v[index] = parseInt(bits[j].data);
                    j++;
                }
            }
            
            var c = [];
            for (var index1 = 0; index1 < numberBitsControl; index1++){
                var sum = 0;
                for (var index2 = Math.pow(2,index1)-1; index2 < v.length; index2= index2 + Math.pow(2,index1+1)){
                    for (var index3 = 0; (index3 < Math.pow(2,index1)) && (index2+index3 < v.length); index3++){
                        sum += v[index2 + index3];
                    }     
                }
                c[index1] = this.parity(sum + 1);
                v[Math.pow(2,index1)-1] = c[index1];
            }
            console.log(v);
            console.log("Control bits: " + c);
            return v;
        },
        parity: function(number){
            return number % 2;
        },
        validate: function(bits){
            for(var i=0; i<bits.length;i++){
                if (this.validateBit(bits[i].data) === false)
                return false;
            }
            return true;
        },
        validateBit: function(character){
            if (character === null) return false;
            return (parseInt(character) === 0 ||
            parseInt(character) === 1);  
        }
    }
})