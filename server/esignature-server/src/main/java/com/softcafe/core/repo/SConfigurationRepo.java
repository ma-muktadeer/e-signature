package com.softcafe.core.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.softcafe.core.model.SConfiguration;

public interface SConfigurationRepo
		extends JpaRepository<SConfiguration, Long>, JpaSpecificationExecutor<SConfiguration> {
	@Query(value = "SELECT  U FROM SConfiguration U where active = 1")
	List<SConfiguration> findAll();

	@Query(value = "SELECT  U FROM SConfiguration U " + "where active = 1 " + " and configGroup = :configGroup "
			+ " and configSubGroup = :configSubGroup " + " and value1 = :value1 " + " and value1 is not null ")
	public SConfiguration duplicate(@Param("configGroup") String configGroup,
			@Param("configSubGroup") String configSubGroup, @Param("value1") String value1);

	public List<SConfiguration> findByConfigGroupAndActive(String configGroup, int active);

	@Query(value="SELECT new com.softcafe.core.model.SConfiguration(C.configId, C.active, C.creatorId, C.configGroup, C.configSubGroup, C.securityQuestionId, C.value1, C.value5) FROM SConfiguration C "
			+ "WHERE C.configGroup = :configGroup AND C.configSubGroup = :configSubGroup AND active = :active")
	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndActive(String configGroup, String configSubGroup,
			int active);

	@Query(value="SELECT new com.softcafe.core.model.SConfiguration(C.configId, C.active, C.creatorId, C.configGroup, C.configSubGroup, C.securityQuestionId, C.value1, C.value5) FROM SConfiguration C "
			+ "WHERE C.configGroup = :configGroup AND C.configSubGroup = :configSubGroup AND C.value5 = :value5 AND active = :active")
	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndValue5AndActive(String configGroup,
			String configSubGroup, String value5, int active);

	public SConfiguration findByConfigGroupAndConfigSubGroupAndConfigNameAndActive(String configGroup,
			String configSubGroup, String configName, int active);

	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndConfigNameInAndActive(String configGroup,
			String configSubGroup, List<String> configName, int active);

	public List<SConfiguration> findByConfigGroupAndConfigSubGroupAndConfigNameAndActiveOrderByValue1Asc(
			String configGroup, String configSubGroup, String configName, int active);

	SConfiguration findByConfigIdAndActive(Long configId, int i);

	boolean existsByConfigGroupAndConfigSubGroupAndActive(String configGroup, String configSubGroup, int i);

	List<SConfiguration> findAllByConfigGroupAndConfigSubGroupAndValue5AndActive(String sigViewSetup,
			String sigViewSubgroup, String value5, int i);

	List<SConfiguration> findByConfigGroupAndConfigSubGroupAndActiveOrderByConfigVerAsc(String sigViewSetup,
			String sigViewSubgroup, int i);
	List<SConfiguration> findByConfigGroupAndConfigSubGroupAndValue5AndActiveOrderByConfigVerAsc(String sigViewSetup,
			String sigViewSubgroup, String value5, int i);

	List<SConfiguration> findByConfigGroupAndConfigSubGroupAndValue5AndActive(String question, String questionAns,
			Long questionId, int active);
	

	List<SConfiguration> findAllByConfigGroupAndConfigSubGroupAndValue5InAndActive(String actionType,
			String actionType2, List<String> vlue5List, int i);
	
	List<SConfiguration> findAllByConfigGroupAndValue5InAndActive(String actionType,
			 List<String> vlue5List, int i);

	List<SConfiguration> findAllByConfigGroupAndConfigSubGroupAndActive(String configGroup, String configSubGroup,
			int i);
	
	
//	@Query("SELECT c FROM SConfiguration c WHERE c.configGroup = :configGroup AND c.active = :active")
	List<SConfiguration> findAllByConfigSubGroupAndActive(@Param("configSubGroup") String configSubGroup,
			@Param("active") Integer active);


}
