import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FormInput.css';

const FormInput = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedPort, setSelectedPort] = useState('');
    const [ports, setPorts] = useState([]);
    const [barang, setBarang] = useState('');
    const [barangResponse, setBarangResponse] = useState('');
    const [harga, setHarga] = useState('');
    const [tarifBeaMasuk, setTarifBeaMasuk] = useState('');
    const [total, setTotal] = useState('');
    const selectedChars = selectedCountry.substring(0, 3);

    useEffect(() => {
        if (selectedCountry.length >= 3) {
            axios.get(`https://insw-dev.ilcs.co.id/my/n/negara?ur_negara=${selectedCountry}`)
                .then(response => {
                    if (response.data.data.length > 0) {
                        setSelectedCountry(response.data.data[0].ur_negara);
                    }
                })
                .catch(error => {
                    console.error('Error fetching countries:', error);
                });
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedCountry && selectedPort.length >= 3) {
            axios.get(`https://insw-dev.ilcs.co.id/my/n/negara?ur_negara=${selectedChars}`)
                .then(response => {
                    if (response.data.data.length > 0) {
                        const kdNegara = response.data.data[0].kd_negara;
                        axios.get(`https://insw-dev.ilcs.co.id/my/n/pelabuhan?kd_negara=${kdNegara}&ur_pelabuhan=${selectedPort}`)
                            .then(response => {
                                if (response.data.data.length > 0) {
                                    setSelectedPort(response.data.data[0].ur_pelabuhan);
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching ports:', error);
                            });
                    }
                })
                .catch(error => {
                    console.error('Error fetching countries:', error);
                });
        }
    }, [selectedCountry, selectedPort]);

    useEffect(() => {
        axios.get(`https://insw-dev.ilcs.co.id/my/n/barang?hs_code=${barang}`)
            .then(response => {
                const respMapping =  response.data.data[0].hs_code_format +" "+ response.data.data[0].uraian_id+" - "+response.data.data[0].sub_header
                setBarangResponse(respMapping);
                console.log(response.data)
            }).catch(e =>{
                console.log(e)
        })

    }, [barang]);


    const handleBarangChange = (e) => {
        setBarang(e.target.value);

    };
    const handlehargaChange = (e) => {
        setHarga(e.target.value);
        axios.get(`https://insw-dev.ilcs.co.id/my/n/tarif?hs_code=${barang}`)
            .then(response => {
                setTarifBeaMasuk( response.data.data[0].bm )
                const countTarifBeaMasuk= harga * response.data.data[0].bm / 100
                setTotal(countTarifBeaMasuk)

            }).catch(e =>{
            console.log(e)
        })
    };



    const handleBmChange = (e) => {
        
        setTarifBeaMasuk(e.target.value)
    }

    const handleTotalBmChange = () => {
        setTotal()
    };
    return (
        <div className="container">
            <div>
                <label className="label">Negara:</label>
                <input
                    className="input-field"
                    type="text"
                    value={selectedCountry}
                    onChange={e => setSelectedCountry(e.target.value)}
                />
                <ul className="input-list">
                    {countries.map(country => (
                        <li key={country.kd_negara} className="input-list-item">{country.ur_negara}</li>
                    ))}
                </ul>
            </div>
            <div>
                <label className="label">Pelabuhan:</label>
                <input
                    className="input-field"
                    type="text"
                    value={selectedPort}
                    onChange={e => setSelectedPort(e.target.value)}
                />
                <ul className="input-list">
                    {ports.map(port => (
                        <li key={port.kd_pelabuhan} className="input-list-item">{port.ur_pelabuhan}</li>
                    ))}
                </ul>
            </div>
            <div>
                <label className="label">Barang:</label>
                <input
                    className="input-field"
                    type="text"
                    value={barang}
                    onChange={handleBarangChange}
                />

                <textarea
                    className="input-field"
                    rows="4"
                    cols="50"
                    value={barangResponse}
                    onChange={handleBarangChange}
                    placeholder="Enter your text here"
                />
            </div>
            <div>
                <label className="label">Harga:</label>
                <input
                    className="input-field"
                    type="text"
                    value={harga}
                    onChange={handlehargaChange}
                />
            </div>
            <div>
                <label className="label">Tarif Bea Masuk:</label>
                <input
                    className="input-field"
                    type="text"
                    value={tarifBeaMasuk+"%"}
                    onChange={handleBmChange}
                />
                <input
                    className="input-field"
                    type="text"
                    value={total}
                    onChange={handleTotalBmChange}
                />
            </div>
        </div>
    );
};

export default FormInput;
