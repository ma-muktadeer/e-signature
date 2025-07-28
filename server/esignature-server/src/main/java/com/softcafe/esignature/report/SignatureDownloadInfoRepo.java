package com.softcafe.esignature.report;

import org.springframework.data.jpa.repository.JpaRepository;

import com.softcafe.esignature.entity.SignatureDownloadInfo;

public interface SignatureDownloadInfoRepo extends JpaRepository<SignatureDownloadInfo, Long>{

}
