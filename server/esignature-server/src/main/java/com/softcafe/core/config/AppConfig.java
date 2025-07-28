package com.softcafe.core.config;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import com.delfian.core.message.interfaces.Service;
import com.delfian.core.message.processor.service.ProcessorService;
import com.delfian.core.message.service.ServiceCoordinator;
import com.delfian.core.message.service.ServiceMap;
import com.softcafe.core.model.AppPermission;
import com.softcafe.core.model.Branch;
import com.softcafe.core.model.Dashboard;
import com.softcafe.core.model.DocumentFiles;
import com.softcafe.core.model.GenericMap;
import com.softcafe.core.model.Group;
import com.softcafe.core.model.Location;
import com.softcafe.core.model.Role;
import com.softcafe.core.model.RoleGroup;
import com.softcafe.core.model.SConfiguration;
import com.softcafe.core.model.User;
import com.softcafe.core.service.AppPermissionService;
import com.softcafe.core.service.BranchService;
import com.softcafe.core.service.DocumentFilesService;
import com.softcafe.core.service.GenericMapService;
import com.softcafe.core.service.LocationService;
import com.softcafe.core.service.RoleGroupService;
import com.softcafe.core.service.RoleService;
import com.softcafe.core.service.SConfigurationService;
import com.softcafe.core.service.UserService;
import com.softcafe.esignature.entity.ActivityLog;
import com.softcafe.esignature.entity.FreeText;
import com.softcafe.esignature.entity.Institution;
import com.softcafe.esignature.entity.MailTemplete;
import com.softcafe.esignature.entity.Request;
import com.softcafe.esignature.entity.SecurityQuestion;
import com.softcafe.esignature.entity.SecurityQuestionAnswer;
import com.softcafe.esignature.entity.Signatory;
import com.softcafe.esignature.entity.Signature;
import com.softcafe.esignature.entity.SignatureInfo;
import com.softcafe.esignature.report.ReportSearch;
import com.softcafe.esignature.service.ActivityLogService;
import com.softcafe.esignature.service.FreeTextService;
import com.softcafe.esignature.service.InstitutionService;
import com.softcafe.esignature.service.MailTempleteService;
import com.softcafe.esignature.service.ReportSearchService;
import com.softcafe.esignature.service.RequestService;
import com.softcafe.esignature.service.SecurityQuestionAnswerService;
import com.softcafe.esignature.service.SecurityQuestionService;
import com.softcafe.esignature.service.SignatoryService;
import com.softcafe.esignature.service.SignatureInfoService;
import com.softcafe.esignature.service.SignatureService;

@Configuration
@ImportResource("classpath:servlet-context.xml")
@EnableScheduling
@ComponentScan(basePackages = { "com.softcafe" })
@EnableWebSecurity
public class AppConfig {

	@Autowired
	UserService userService;
	@Autowired
	LocationService locationService;
	@Autowired
	SConfigurationService sConfigurationService;
	@Autowired
	BranchService branchService;
	
	@Autowired
	GenericMapService genericMapService;
	@Autowired
	RoleGroupService roleGroupService;

	@Autowired
	AppPermissionService appPermissionService;

	@Autowired
	RoleService roleService;

	@Autowired
	FreeTextService freeTextService;

	@Autowired
	SecurityQuestionService securityQuestionService;
	@Autowired
	SignatureService signatureService;
	@Autowired
	SignatoryService signatoryService;
	@Autowired
	SignatureInfoService signatureInfoService;
	
	@Autowired
	ActivityLogService activityLogService;

	@Autowired
	SecurityQuestionAnswerService securityQuestionAnswerService;
	@Autowired
	InstitutionService institutionService;
	@Autowired
	RequestService requestService;
	@Autowired
	DocumentFilesService documentFilesService;
	@Autowired
	private MailTempleteService mailTemplateService;
	@Autowired
	ReportSearchService reportSearchService;

	@Bean
	public ServiceCoordinator ServiceCoordinator() {
		ServiceCoordinator sc = new ServiceCoordinator();
		sc.setServiceMap(serviceMap());

		return sc;
	}

	@Bean
	public ServiceMap serviceMap() {
		ServiceMap serviceMap = new ServiceMap();
		Map<String, Service<?>> map = new LinkedHashMap<>();
		map.put(UserService.class.getSimpleName(), userService);
		map.put(LocationService.class.getSimpleName(), locationService);
		map.put(SConfigurationService.class.getSimpleName(), sConfigurationService);
		map.put(BranchService.class.getSimpleName(), branchService);
		
		map.put(GenericMapService.class.getSimpleName(), genericMapService);
		map.put(RoleGroupService.class.getSimpleName(), roleGroupService);
		map.put(AppPermissionService.class.getSimpleName(), appPermissionService);
		map.put(RoleService.class.getSimpleName(), roleService);
		map.put(FreeTextService.class.getSimpleName(), freeTextService);

		map.put(SignatureService.class.getSimpleName(), signatureService);
		map.put(SecurityQuestionService.class.getSimpleName(), securityQuestionService);
		map.put(SignatoryService.class.getSimpleName(), signatoryService);
		map.put(SecurityQuestionAnswerService.class.getSimpleName(), securityQuestionAnswerService);
		map.put(SignatureInfoService.class.getSimpleName(), signatureInfoService);
		
		map.put(InstitutionService.class.getSimpleName(), institutionService);
		map.put(RequestService.class.getSimpleName(), requestService);
		map.put(DocumentFilesService.class.getSimpleName(), documentFilesService);
		map.put(MailTempleteService.class.getSimpleName(), mailTemplateService);
		map.put(ActivityLogService.class.getSimpleName(), activityLogService);
		map.put(ReportSearchService.class.getSimpleName(), reportSearchService);
		
		
		
		serviceMap.setServiceMap(map);
		return serviceMap;
	}

	@Bean
	ProcessorService processorService() {
		ProcessorService processorService = new ProcessorService();

		Map<String, String> classMap = new LinkedHashMap<>();

		mapClass(classMap, User.class);
		mapClass(classMap, Location.class);
		mapClass(classMap, SConfiguration.class);
		mapClass(classMap, Branch.class);
		mapClass(classMap, Dashboard.class);
		mapClass(classMap, MailTemplete.class);
		mapClass(classMap, Group.class);
		mapClass(classMap, GenericMap.class);
		mapClass(classMap, RoleGroup.class);
		mapClass(classMap, AppPermission.class);
		mapClass(classMap, Role.class);
		mapClass(classMap, FreeText.class);
		mapClass(classMap, Signature.class);
		mapClass(classMap, SecurityQuestion.class);
		mapClass(classMap, Signatory.class);
		mapClass(classMap, SecurityQuestionAnswer.class);
		mapClass(classMap, SignatureInfo.class);
		
		mapClass(classMap, Institution.class);
		mapClass(classMap, Request.class);
		mapClass(classMap, DocumentFiles.class);
		mapClass(classMap, MailTemplete.class);
		mapClass(classMap, ActivityLog.class);
		mapClass(classMap, ReportSearch.class);
		
		
		processorService.setClassMap(classMap);
		return processorService;
	}

	private void mapClass(Map<String, String> classMap, Class<?> clazz) {
		classMap.put(clazz.getSimpleName(), clazz.getName());
	}
}
