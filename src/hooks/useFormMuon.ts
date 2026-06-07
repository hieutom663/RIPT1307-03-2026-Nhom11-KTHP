import { useState, useCallback } from 'react';

export const useFormMuon = () => {
    const [visible, setVisible] = useState(false);
    const [thietBiChon, setThietBiChon] = useState<any>(null);
    const [muonVisible, setMuonVisible] = useState(false);
    
    const [soLuongMuon, setSoLuongMuon] = useState(1);
    const [ngayMuon, setNgayMuon] = useState<any>(null);
    const [ngayTra, setNgayTra] = useState<any>(null);
    const [lyDo, setLyDo] = useState('');

    const moChiTiet = useCallback((thietBi: any) => {
        setThietBiChon(thietBi);
        setVisible(true);
    }, []);

    const dongChiTiet = useCallback(() => {
        setVisible(false);
        setThietBiChon(null);
    }, []);

    const moFormMuon = useCallback(() => {
        setVisible(false);
        setSoLuongMuon(1);
        setNgayMuon(null);
        setNgayTra(null);
        setLyDo('');
        setMuonVisible(true);
    }, []);

    const dongFormMuon = useCallback(() => {
        setMuonVisible(false);
    }, []);

    const handleChangeSoLuongMuon = useCallback((giaTri: any) => setSoLuongMuon(giaTri), []);
    const handleChangeNgayMuon = useCallback((ngay: any) => setNgayMuon(ngay), []);
    const handleChangeNgayTra = useCallback((ngay: any) => setNgayTra(ngay), []);
    const handleChangeLyDo = useCallback((giaTri: any) => setLyDo(giaTri), []);

    return {
        visible, thietBiChon, muonVisible, soLuongMuon, ngayMuon, ngayTra, lyDo,
        moChiTiet, dongChiTiet, moFormMuon, dongFormMuon,
        handleChangeSoLuongMuon, handleChangeNgayMuon, handleChangeNgayTra, handleChangeLyDo
    };
};